import express from 'express';
import { body } from 'express-validator';
import {
  createEquipment,
  getMyEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
  getAvailableEquipment,
} from '../controllers/equipmentController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../utils/upload';
import { AuthenticatedRequest } from '../types/express';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Public route – list available equipment for rent
router.get('/available', getAvailableEquipment);

// Validation
const equipmentValidation = [
  body('equipmentName').notEmpty().withMessage('Equipment name is required'),
  body('equipmentType').notEmpty().withMessage('Equipment type is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('modelNumber').notEmpty().withMessage('Model number is required'),
  body('condition').isIn(['New', 'Good', 'Average']).withMessage('Invalid condition'),
  body('fuelType').isIn(['Diesel', 'Petrol', 'Manual']).withMessage('Invalid fuel type'),
  body('rentalPrice').isFloat({ min: 0 }).withMessage('Rental price must be positive'),
  body('minRentalDuration').isInt({ min: 1 }).withMessage('Minimum duration must be at least 1'),
  body('availabilityStartDate').isISO8601().toDate(),
  body('availabilityEndDate').isISO8601().toDate(),
  body('pickupMethod').isIn(['Self-pickup', 'Delivery available']).withMessage('Invalid pickup method'),
];

// Farmer routes
router.use(protect, restrictTo('farmer'));

router
  .route('/')
  .get((req: Request, res: Response, next: NextFunction) => {
    (req as AuthenticatedRequest).user = req.user!;
    getMyEquipment(req as AuthenticatedRequest, res, next);
  })
  .post(
    upload.array('images', 4),
    equipmentValidation,
    (req: Request, res: Response, next: NextFunction) => {
      (req as AuthenticatedRequest).user = req.user!;
      createEquipment(req as AuthenticatedRequest, res, next);
    }
  );

router
  .route('/:id')
  .get(getEquipment)
  .patch(
    upload.array('images', 4),
    (req: Request, res: Response, next: NextFunction) => {
      (req as AuthenticatedRequest).user = req.user!;
      updateEquipment(req as AuthenticatedRequest, res, next);
    }
  )
  .delete((req: Request, res: Response, next: NextFunction) => {
    (req as AuthenticatedRequest).user = req.user!;
    deleteEquipment(req as AuthenticatedRequest, res, next);
  });

export default router;
