import { Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import Wishlist from '../models/wishlistModel.js';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../types/express';

// Create a type-safe async handler
type AsyncRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

function asyncHandlerWrapper(handler: AsyncRequestHandler): RequestHandler {
  return asyncHandler(handler as any);
}

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandlerWrapper(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }
  const wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate('products')
    .lean();
    
  res.json(wishlist?.products || []);
});

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = asyncHandlerWrapper(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }
  const { productId } = req.body;
  
  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }
  
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  
  if (!wishlist) {
    // Create new wishlist if it doesn't exist
    wishlist = await Wishlist.create({ 
      user: req.user.id, 
      products: [productId] 
    });
  } else if (!wishlist.products.includes(productId)) {
    // Add product if not already in wishlist
    wishlist.products.push(productId);
    await wishlist.save();
  }
  
  const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
  if (!updatedWishlist) {
    res.status(500);
    throw new Error('Failed to retrieve updated wishlist');
  }
  res.status(201).json(updatedWishlist.products);
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandlerWrapper(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  
  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }
  
const productIdObj = new Types.ObjectId(req.params.productId);
const productIndex = wishlist.products.indexOf(productIdObj);
  
  if (productIndex > -1) {
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();
    res.json({ message: 'Product removed from wishlist' });
  } else {
    res.status(404);
    throw new Error('Product not found in wishlist');
  }
});
