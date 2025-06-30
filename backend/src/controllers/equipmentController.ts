import { Request, Response, NextFunction } from 'express';
import Equipment, { IEquipment } from '../models/equipmentModel';
import { AuthenticatedRequest } from '../types/express';
import { handleFileUpload, handleMultipleFilesUpload } from '../utils/upload';

// Helper to parse number fields safely
const parseNumber = (value: any): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

export const createEquipment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      equipmentName,
      equipmentType,
      brand,
      modelNumber,
      condition,
      fuelType,
      rentalPrice,
      minRentalDuration,
      maxRentalDuration,
      availabilityStartDate,
      availabilityEndDate,
      pickupMethod,
    } = req.body;

    // Handle uploaded images
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls = (await handleMultipleFilesUpload(req.files as any)).map(f => f.url);
    } else if (req.file) {
      const single = await handleFileUpload(req.file as any);
      imageUrls.push(single.url);
    }

    const equipment: Partial<IEquipment> = {
      equipmentName,
      equipmentType,
      brand,
      modelNumber,
      condition,
      fuelType,
      rentalPrice: parseNumber(rentalPrice)!,
      minRentalDuration: parseNumber(minRentalDuration)!,
      maxRentalDuration: parseNumber(maxRentalDuration),
      availabilityStartDate,
      availabilityEndDate,
      pickupMethod,
      images: imageUrls,
      owner: req.user!._id,
    };

    const created = await Equipment.create(equipment);
    res.status(201).json({ status: 'success', data: { equipment: created } });
  } catch (error) {
    next(error);
  }
};

export const getMyEquipment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const equipments = await Equipment.find({ owner: req.user!._id }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: { equipments } });
  } catch (error) {
    next(error);
  }
};

export const getEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eq = await Equipment.findById(req.params.id);
    if (!eq) return res.status(404).json({ status: 'error', message: 'Equipment not found' });
    res.json({ status: 'success', data: { equipment: eq } });
  } catch (error) {
    next(error);
  }
};

export const updateEquipment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates = { ...req.body };
    if (req.files && Array.isArray(req.files)) {
      const filesInfo = await handleMultipleFilesUpload(req.files as any);
      updates.images = filesInfo.map(f => f.url);
    }
    const updated = await Equipment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user!._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ status: 'error', message: 'Equipment not found' });
    res.json({ status: 'success', data: { equipment: updated } });
  } catch (error) {
    next(error);
  }
};

export const deleteEquipment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await Equipment.findOneAndDelete({ _id: req.params.id, owner: req.user!._id });
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Equipment not found' });
    res.status(204).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get all equipment currently available for rental.
 * Criteria: current date lies within availability window.
 */
export const getAvailableEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const today = new Date();
    // Find equipment where today's date is within availability range
    const equipments = await Equipment.find({
      availabilityEndDate: { $gte: today },
    }).sort({ createdAt: -1 });

    res.json({ status: 'success', data: { equipments } });
  } catch (error) {
    next(error);
  }
};
