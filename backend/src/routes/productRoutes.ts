import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  getActiveProducts,
  getFarmerProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { 
  getAllProducts, 
  getProductDetails,
  approveProduct, 
  rejectProduct, 
  toggleProductStatus 
} from '../controllers/adminProductController';
import { AuthenticatedRequest } from '../types/express';
import { upload } from '../utils/upload';

const router = express.Router();

// Public route to fetch all active products
router.get<{}, any, any, any>('/', getActiveProducts);

// Apply protect middleware to all routes below
router.use(protect);

// Product validation rules
const productValidationRules = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('unit')
    .isIn(['kg', 'g', 'piece', 'bunch', 'liter'])
    .withMessage('Invalid unit'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('description').notEmpty().withMessage('Description is required'),
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Low stock threshold must be at least 1'),
];

// Type assertion for authenticated routes
const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ status: 'error', message: 'Not authenticated' });
    return;
  }
  next();
};

// Routes
router
  .route('/')
  .post(
    protect,
    ensureAuthenticated,
    restrictTo('farmer'),
    upload.single('image'),
    productValidationRules,
    (req: Request, res: Response, next: NextFunction) => {
      (req as AuthenticatedRequest).user = req.user!;
      createProduct(req as AuthenticatedRequest, res as Response, next);
    }
  );

// Helper function to create authenticated route handlers
const createAuthHandler = (handler: (req: AuthenticatedRequest, res: Response) => Promise<void> | void): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    authReq.user = req.user!;
    Promise.resolve(handler(authReq, res)).catch(next);
  };
};

// Admin product routes
router.get(
  '/all',
  protect,
  ensureAuthenticated,
  restrictTo('admin'),
  createAuthHandler(async (req, res) => {
    await getAllProducts(req, res);
  })
);

// Get product details (admin)
router.get(
  '/admin/:id',
  protect,
  ensureAuthenticated,
  restrictTo('admin'),
  createAuthHandler(async (req, res) => {
    await getProductDetails(req, res);
  })
);

// Approve product
router.patch(
  '/:id/approve',
  protect,
  ensureAuthenticated,
  restrictTo('admin'),
  createAuthHandler(async (req, res) => {
    await approveProduct(req, res);
  })
);

// Reject product
router.patch(
  '/:id/reject',
  protect,
  ensureAuthenticated,
  restrictTo('admin'),
  createAuthHandler(async (req, res) => {
    await rejectProduct(req, res);
  })
);

// Toggle product status (active/inactive)
router.patch(
  '/:id/toggle-status',
  protect,
  ensureAuthenticated,
  restrictTo('admin'),
  createAuthHandler(async (req, res) => {
    await toggleProductStatus(req, res);
  })
);

router.get(
  '/farmer',
  protect,
  ensureAuthenticated,
  restrictTo('farmer'),
  (req: Request, res: Response, next: NextFunction) => {
    (req as AuthenticatedRequest).user = req.user!;
    getFarmerProducts(req as AuthenticatedRequest, res as Response, next);
  }
);

// Legacy status update endpoint (kept for backward compatibility)
router.patch(
  '/:id/status',
  protect,
  ensureAuthenticated,
  restrictTo('admin'),
  createAuthHandler(async (req, res) => {
    // This will use the toggleProductStatus for backward compatibility
    await toggleProductStatus(req, res);
  })
);

router
  .route('/:id')
  .get((req: Request, res: Response, next: NextFunction) => {
    (req as AuthenticatedRequest).user = req.user!;
    getProduct(req as AuthenticatedRequest, res as Response, next);
  })
  .patch(
    protect,
    ensureAuthenticated,
    restrictTo('farmer'),
    upload.single('image'),
    (req: Request, res: Response, next: NextFunction) => {
      (req as AuthenticatedRequest).user = req.user!;
      updateProduct(req as AuthenticatedRequest, res as Response, next);
    }
  )
  .delete(
    protect,
    ensureAuthenticated,
    restrictTo('farmer'),
    (req: Request, res: Response, next: NextFunction) => {
      (req as AuthenticatedRequest).user = req.user!;
      deleteProduct(req as AuthenticatedRequest, res as Response, next);
    }
  );

export default router;
