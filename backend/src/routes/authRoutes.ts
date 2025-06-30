import express from 'express';
import * as authController from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.use(protect);

router.get('/me', authController.getMe);
router.get('/logout', authController.logout);

export default router;
