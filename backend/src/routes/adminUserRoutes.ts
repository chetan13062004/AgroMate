import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware';
import * as adminUserController from '../controllers/adminUserController';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, restrictTo('admin'));

router.get('/', adminUserController.getAllUsers);
router.patch('/:id', adminUserController.updateUser);

export default router;
