import { Request, Response } from 'express';
import Order from '../models/orderModel';
import { AuthenticatedRequest } from '../types/express';

// Utility to build a Mongo find object from query params
function buildFilter(query: any) {
  const filter: Record<string, any> = {};

  if (query.status && ['placed', 'processing', 'in_transit', 'delivered', 'cancelled', 'shipped'].includes(query.status)) {
    // We allow legacy value shipped/in_transit etc.
    filter.status = query.status === 'shipped' ? 'in_transit' : query.status;
  }

  if (query.user) {
    filter.user = query.user; // expecting an ObjectId string
  }

  // Add date range filtering if provided (?from=2025-01-01&to=2025-01-31)
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) {
      const toDate = new Date(query.to);
      toDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = toDate;
    }
  }

  return filter;
}

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const filter = buildFilter(req.query);

    const orders = await Order.find(filter)
      .populate({ path: 'items.product', populate: { path: 'farmer', select: 'name' } })
      .populate('user', '-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders },
    });
  } catch (error) {
    console.error('Admin getAllOrders error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const allowedStatuses = ['processing', 'in_transit', 'delivered', 'cancelled'];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    const updated = await order.save();

    return res.status(200).json({ status: 'success', data: { order: updated } });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to update order' });
  }
};

// (Optional) Export orders as CSV
export const exportOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('items.product user');

    const header = 'OrderID,Customer,Total,Status,Created At\n';
    const rows = orders
      .map((o) => `${o._id},${(o as any).user?.name || ''},${o.total},${o.status},${o.createdAt.toISOString()}`)
      .join('\n');

    const csv = header + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    return res.send(csv);
  } catch (error) {
    console.error('Export orders error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to export orders' });
  }
};
