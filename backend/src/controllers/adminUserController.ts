import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import CustomError from '../utils/errorHandler';

// GET /api/admin/users
export const getAllUsers = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { search = '', role, approved, page = '1', limit = '20' } = req.query as Record<string, string>;

  const queryFilter: any = {};

  if (role && role !== 'all') {
    queryFilter.role = role;
  }

  if (approved === 'true') queryFilter.isApproved = true;
  if (approved === 'false') queryFilter.isApproved = false;

  if (search) {
    const regex = new RegExp(search, 'i');
    queryFilter.$or = [
      { name: regex },
      { email: regex },
    ];
  }

  const pageNum = +page;
  const limitNum = +limit;
  const skip = (pageNum - 1) * limitNum;

  const usersPromise = User.find(queryFilter).skip(skip).limit(limitNum).select('-password');
  const countPromise = User.countDocuments(queryFilter);

  const [users, total] = await Promise.all([usersPromise, countPromise]);

  // simple stats used by admin dashboard cards
  const totalUsersP = User.countDocuments();
  const activeFarmersP = User.countDocuments({ role: 'farmer', isApproved: true });
  const activeBuyersP = User.countDocuments({ role: 'buyer' });
  const pendingApprovalP = User.countDocuments({ role: 'farmer', isApproved: false });

  const [totalUsers, activeFarmers, activeBuyers, pendingApproval] = await Promise.all([
    totalUsersP,
    activeFarmersP,
    activeBuyersP,
    pendingApprovalP,
  ]);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
      total,
      stats: {
        totalUsers,
        activeFarmers,
        activeBuyers,
        pendingApproval,
      },
    },
  });
});

// PATCH /api/admin/users/:id
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('Invalid user id', 400));
  }

  // only allow certain fields to be updated from admin panel
  const allowedFields = ['name', 'role', 'isApproved'];
  const updateData: Partial<IUser> = {} as Partial<IUser>;
  allowedFields.forEach((field) => {
    if (field in req.body) (updateData as any)[field] = (req.body as any)[field];
  });

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');

  if (!updatedUser) {
    return next(new CustomError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});
