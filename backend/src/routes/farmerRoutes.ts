import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { getPendingFarmers, approveFarmer, rejectFarmer, deleteFarmer, getAllFarmers } from '../controllers/adminFarmerController';

const router = express.Router();

// All routes below are protected and admin only
router.use(protect);
router.use(restrictTo('admin'));

router.get('/pending', getPendingFarmers);
router.patch('/:id/approve', approveFarmer);
// Generic update for admin panel (approve/reject)
router.patch('/:id', require('../controllers/adminFarmerController').updateFarmerApproval);
router.patch('/:id/reject', rejectFarmer);
router.delete('/:id', deleteFarmer);
router.get('/', getAllFarmers);

export default router;