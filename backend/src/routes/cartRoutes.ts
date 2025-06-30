import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// All cart routes require authentication and buyer role
router.use(protect, restrictTo('buyer'));

router
  .route('/')
  .get(getCart)   // GET /api/cart
  .post(addToCart); // POST /api/cart

router.delete('/:productId', removeFromCart); // DELETE /api/cart/:productId

export default router;
