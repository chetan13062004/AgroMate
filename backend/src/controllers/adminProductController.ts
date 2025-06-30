import { Response } from 'express';
import Product from '../models/productModel';
import { AuthenticatedRequest } from '../types/express';
import { Types } from 'mongoose';

// @desc    Get all products (admin only) with filtering and pagination
// @route   GET /api/products/all
// @access  Private/Admin
export const getAllProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    const query: any = {};

    // Build the query
    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query)
      .populate('farmer', 'name email phone location avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: { products },
    });
    return;
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
    return;
  }
};

// @desc    Get single product details (admin only)
// @route   GET /api/products/admin/:id
// @access  Private/Admin
export const getProductDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findById(id)
      .populate('farmer', 'name email phone location avatar')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product details',
    });
  }
};

// @desc    Approve a product (admin only)
// @route   PATCH /api/products/:id/approve
// @access  Private/Admin
export const approveProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active',
        rejectionReason: undefined // Clear any previous rejection reason
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // TODO: Send notification to farmer about product approval

    return res.status(200).json({ 
      status: 'success', 
      message: 'Product approved successfully',
      data: { product } 
    });
  } catch (error) {
    console.error('Error approving product:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to approve product' 
    });
  }
};

// @desc    Reject a product (admin only)
// @route   PATCH /api/products/:id/reject
// @access  Private/Admin
export const rejectProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Rejection reason is required' 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason: reason
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // TODO: Send notification to farmer about product rejection with reason

    return res.status(200).json({ 
      status: 'success', 
      message: 'Product rejected successfully',
      data: { product } 
    });
  } catch (error) {
    console.error('Error rejecting product:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to reject product' 
    });
  }
};

// @desc    Toggle product status (active/inactive)
// @route   PATCH /api/products/:id/toggle-status
// @access  Private/Admin
export const toggleProductStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Product not found' 
      });
    }

    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ 
      status: 'success', 
      message: `Product ${newStatus} successfully`,
      data: { product: updatedProduct } 
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to toggle product status' 
    });
  }
};
