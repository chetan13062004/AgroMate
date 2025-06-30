import { Request, Response, NextFunction } from 'express';
import Product from '../models/productModel';
import { AuthenticatedRequest } from '../types/express';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { getFileUrl } from '../utils/upload';
import { promisify } from 'util';

const unlink = promisify(fs.unlink);

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Farmer
export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // --- Detailed Debugging --- 
  console.log('--- Create Product Request Received ---');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('Request File:', req.file);
  // --- End Debugging --- 

  let imagePath: string | undefined;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // --- Detailed Debugging for Validation --- 
      console.error('Validation Errors:', JSON.stringify(errors.array(), null, 2));
      // --- End Debugging --- 

      // Clean up uploaded file if validation fails
      if (req.file) {
        await unlink(req.file.path).catch(console.error);
      }
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    if (!req.user) {
      // Clean up uploaded file if not authenticated
      if (req.file) {
        await unlink(req.file.path).catch(console.error);
      }
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const {
      name,
      category,
      price,
      unit,
      stock,
      description,
      lowStockThreshold = 10,
      expiryDate,
      isOrganic = false,
    } = req.body;

    // Validate expiry date not in past if provided
    if (expiryDate) {
      const exp = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (exp < today) {
        return res.status(400).json({
          status: 'error',
          message: 'Expiry date cannot be in the past',
        });
      }
    }

    // Check if user is a farmer (already checked by middleware, but just in case)
    if (req.user.role !== 'farmer') {
      // Clean up uploaded file if not authorized
      if (req.file) {
        await unlink(req.file.path).catch(console.error);
      }
      return res.status(403).json({
        status: 'error',
        message: 'Only farmers can create products',
      });
    }

    // Handle file upload if present
    if (req.file) {
      // In a real app, you'd want to upload to a cloud storage service
      // For now, we'll just store the path
      imagePath = getFileUrl(req.file.filename);
    }

    // Create product
    const product = await Product.create({
      name,
      category,
      price,
      unit,
      stock,
      description,
      lowStockThreshold,
      farmer: req.user._id,
      status: 'inactive',
      imageUrl: imagePath,
      isOrganic,
      expiryDate, // Ensure expiryDate is passed to the database
    });

    return res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Clean up uploaded file if an error occurs
    if (req.file) {
      await unlink(req.file.path).catch(console.error);
    }
    
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to create product',
    });
  }
};

// @desc    Get all products for the logged-in farmer
// @route   GET /api/products/farmer
// @access  Private/Farmer
export const getFarmerProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    // Increment view count
    product.views += 1;
    const updatedProduct = await product.save();

    return res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
    });
  }
};

// @desc    Update a product (supports partial updates and optional new image)
// @route   PATCH /api/products/:id
// @access  Private/Farmer
export const updateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    // Check if the product belongs to the logged-in farmer
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this product',
      });
    }

    // If a new image is uploaded, update imageUrl and remove the old file
    if (req.file) {
      const fsPath = product.imageUrl ? path.join(process.cwd(), 'uploads', path.basename(product.imageUrl)) : null;
      if (fsPath) {
        await unlink(fsPath).catch(() => {});
      }
      (req.body as any).imageUrl = getFileUrl(req.file.filename);
    }

    // Only include fields that are provided
    const fieldsToUpdate: Record<string, any> = {};

    // Validate expiry date if provided in body
    if (req.body.expiryDate) {
      const exp = new Date(req.body.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (exp < today) {
        return res.status(400).json({
          status: 'error',
          message: 'Expiry date cannot be in the past',
        });
      }
    }

    const allowedFields = [
      'name',
      'category',
      'price',
      'unit',
      'stock',
      'lowStockThreshold',
      'description',
      'imageUrl',
      'featured',
      'isOrganic',
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        fieldsToUpdate[field] = (req.body as any)[field];
      }
    });

    // Automatically adjust product status based on the new stock value, unless the client explicitly sets a status
    if (Object.prototype.hasOwnProperty.call(fieldsToUpdate, 'stock') && !Object.prototype.hasOwnProperty.call(fieldsToUpdate, 'status')) {
      const newStock = Number(fieldsToUpdate.stock);
      if (Number.isFinite(newStock)) {
        if (newStock <= 0) {
          fieldsToUpdate.status = 'out_of_stock';
        } else if (product.status === 'out_of_stock' && newStock > 0) {
          // When stock is replenished, move status back to active
          fieldsToUpdate.status = 'active';
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Farmer
// @desc    Get all active products (public)
// @route   GET /api/products
// @access  Public
export const getActiveProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ status: 'active' }).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching active products:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    // Check if the product belongs to the logged-in farmer
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this product',
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
    });
  }
};
