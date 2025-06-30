import { Request, Response, NextFunction } from 'express';
import Cart from '../models/cartModel';
import Product from '../models/productModel';
import Order from '../models/orderModel';
import { IProduct } from '../models/productModel';
import { calculateDeliveryFee } from '../utils/cartUtils';
import { AuthenticatedRequest } from '../types/express';

// @desc    Checkout current cart and create an order
// @route   POST /api/orders/checkout
// @access  Private/Buyer
// @desc    Get logged-in buyer's orders
// @route   GET /api/orders
// @access  Private/Buyer
export const getMyOrders = async (req: Request, res: Response) => {
  const userReq = req as AuthenticatedRequest
  try {
    const orders = await Order.find({ user: userReq.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get single order by id (buyer can access own order, farmer/admin can access related)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  const userReq = req as AuthenticatedRequest
  try {
    const order = await Order.findById(req.params.id).populate('items.product user', '-password')
    if (!order) return res.status(404).json({ message: 'Order not found' })

    // Allow if owner or admin
    if (order.user.toString() !== userReq.user._id.toString() && userReq.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' })
    }

    res.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get all orders containing products belonging to the logged-in farmer
// @route   GET /api/orders/farmer
// @access  Private/Farmer
export const getFarmerOrders = async (req: Request, res: Response) => {
  const userReq = req as AuthenticatedRequest;
  try {
    // Find all orders where any order item references a product belonging to this farmer
    const orders = await Order.find({
      'items.product': { $exists: true }
    })
      .populate({
        path: 'items.product',
        match: { farmer: userReq.user._id },
      })
      .populate('user', '-password')
      .sort({ createdAt: -1 });

    // Only keep orders where at least one item.product is not null (i.e., belongs to this farmer)
    const filteredOrders = orders.filter(order =>
      order.items.some(item => {
        const prod = item.product as unknown as IProduct; // populated document has farmer field
        return prod && prod.farmer && prod.farmer.equals(userReq.user._id);
      })
    );

    res.json(filteredOrders);
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  const userReq = req as AuthenticatedRequest;
  try {
    const cart = await Cart.findOne({ user: userReq.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items and validate stock
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of cart.items) {
      const product: any = item.product;
      if (!product || product.status !== 'active') {
        return res.status(400).json({ message: `Product ${item.product} not available` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }
      subtotal += product.price * item.quantity;
      orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
    }

    const deliveryFee = calculateDeliveryFee(subtotal);
    const total = subtotal + deliveryFee;

    // Create order
    const order = await Order.create({
      user: userReq.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
    });

    // Update stock atomically for each product
    const bulkOps = cart.items.map((item: any) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: {
          $inc: { stock: -item.quantity, totalSold: item.quantity },
          $set: { status: item.product.stock - item.quantity <= 0 ? 'out_of_stock' : 'active' },
        },
      },
    }));

    if (bulkOps.length) {
      await Product.bulkWrite(bulkOps);
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
