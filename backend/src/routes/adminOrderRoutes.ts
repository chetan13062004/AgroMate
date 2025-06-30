import express, { Request, Response, NextFunction } from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { getAllOrders, updateOrderStatus, exportOrders } from '../controllers/adminOrderController';

const router = express.Router();

// Ensure user is authenticated and an admin
router.use(protect, (req: Request, res: Response, next: NextFunction) => {
  // ...
  return;

  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}, restrictTo('admin'));

router.get('/', getAllOrders);
router.get('/export', exportOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;
