import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface ILocation {
  lat: number;
  lng: number;
  address: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'buyer' | 'admin';
  location?: ILocation;
  avatar?: string;
  // Indicates whether the farmer account has been approved by an admin
  isApproved: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toObject(options?: any): any;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin'],
    default: 'buyer',
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  avatar: {
    type: String,
    default: '',
  },
  isApproved: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);

export default User;
