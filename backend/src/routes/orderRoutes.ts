import express from 'express';
import { checkout, getMyOrders, getOrderById, getFarmerOrders } from '../controllers/orderController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// Buyer routes (must come **before** farmer/id routes to avoid conflicts)
router.get('/', protect, restrictTo('buyer'), getMyOrders);
router.post('/checkout', protect, restrictTo('buyer'), checkout);

// Farmer routes
router.get('/farmer', protect, restrictTo('farmer'), getFarmerOrders);

// Generic order detail route – any authenticated user can hit this (access control inside controller)
router.get('/:id', protect, getOrderById);

export default router;
