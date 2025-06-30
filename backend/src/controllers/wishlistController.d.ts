import { Request, Response } from 'express';

export declare const getWishlist: (req: Request, res: Response) => Promise<void>;
export declare const addToWishlist: (req: Request, res: Response) => Promise<void>;
export declare const removeFromWishlist: (req: Request, res: Response) => Promise<void>;
