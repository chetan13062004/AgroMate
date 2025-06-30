import { Response } from 'express';
import Cart from '../models/cartModel';
import Product from '../models/productModel';
import { AuthenticatedRequest } from '../types/express';
import { calculateDeliveryFee } from '../utils/cartUtils';

// @desc    Add product to cart (or increase quantity)
// @route   POST /api/cart
// @access  Private/Buyer
export const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    let { productId, quantity = 1 } = req.body as any;

    // If an entire product object was sent, grab its id
    if (typeof productId === 'object' && productId !== null) {
      productId = productId._id || productId.id || undefined;
    }

    

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    // Validate productId format
    if (!productId || !require('mongoose').Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    // Find or create cart for user
    const cart = await Cart.findOneAndUpdate(
      { user: req.user!._id },
      { $setOnInsert: { user: req.user!._id, items: [] } },
      { new: true, upsert: true }
    );

    // Check if item already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private/Buyer
export const getCart = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product');

    // If cart is empty, return defaults
    if (!cart) {
      return res.status(200).json({ items: [], subtotal: 0, deliveryFee: 0, total: 0 });
    }

    // Calculate subtotal based on populated product prices
    const subtotal = cart.items.reduce((sum, item: any) => {
      const productPrice = (item.product as any).price || 0;
      return sum + productPrice * item.quantity;
    }, 0);

    const deliveryFee = calculateDeliveryFee(subtotal);
    const total = subtotal + deliveryFee;

    // Send full cart with pricing summary
    res.status(200).json({ ...cart.toObject(), subtotal, deliveryFee, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private/Buyer
export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  try {
    const { productId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
