import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import { CustomError } from '../utils/errorHandler';

/**
 * Update the currently authenticated user's profile (name, avatar, location, etc.)
 * Only non-sensitive fields are allowed here – not password or role.
 */
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new CustomError('Not authenticated', 401));
    }

    // Define which fields are allowed to be updated from the client.
    const allowedFields = ['name', 'avatar', 'location'];
    const updates: Record<string, any> = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return next(new CustomError('No valid fields provided for update.', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    next(error as Error);
  }
};
