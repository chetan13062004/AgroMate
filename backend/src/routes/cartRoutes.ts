import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// All cart routes require authentication and buyer role
router.use(protect, restrictTo('buyer'));

router
  .route('/')
  .get(getCart as import('express').RequestHandler)   // GET /api/cart
  .post(addToCart as import('express').RequestHandler); // POST /api/cart

router.delete('/:productId', removeFromCart as import('express').RequestHandler); // DELETE /api/cart/:productId

export default router;
