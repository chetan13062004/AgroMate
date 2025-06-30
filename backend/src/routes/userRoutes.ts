import express from 'express';
import { protect } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';

const router = express.Router();

// All routes below require authentication
router.use(protect);

// PATCH /api/users/me — update logged-in user's profile
router.patch('/me', userController.updateMe);

export default router;
