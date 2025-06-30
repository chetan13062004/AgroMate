import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { CustomError } from '../utils/errorHandler';
import { IUser } from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Protect routes
export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1) Getting token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new CustomError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new CustomError('The user belonging to this token no longer exists.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || (error as any).name === 'TokenExpiredError') {
      return next(new CustomError('Token expired. Please log in again.', 401));
    }
    next(error as Error);
  }
};

// Restrict to certain roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new CustomError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
