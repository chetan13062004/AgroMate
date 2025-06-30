import { Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

declare const Wishlist: import('mongoose').Model<IWishlist> & {
  // Add any static methods here if needed
};

export default Wishlist;
