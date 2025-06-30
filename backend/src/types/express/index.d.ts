import { IUser } from '../../models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface AuthenticatedRequest extends Express.Request {
  user: IUser;
  body: any;
  params: any;
  [key: string]: any; // For any additional properties that might be added by middleware
}

// This file extends the Express Request type to include the user property
