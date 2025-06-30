import { Request } from 'express';
import { IUser } from '../models/userModel';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}
