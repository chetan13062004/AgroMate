import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  description: string;
  imageUrl?: string;
  lowStockThreshold: number;
  farmer: mongoose.Types.ObjectId;
  featured: boolean;
  totalSold: number;
  revenue: number;
  views: number;
  expiryDate?: Date;
  totalValue: number;
  isOrganic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: ['kg', 'g', 'piece', 'bunch', 'liter'],
        message: 'Invalid unit type',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'out_of_stock'],
      default: 'inactive',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    imageUrl: {
      type: String,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [1, 'Low stock threshold must be at least 1'],
    },
    farmer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
    },
    totalValue: {
      type: Number,
      default: 0,
      min: [0, 'Total value cannot be negative'],
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Update status based on stock before saving
productSchema.pre<IProduct>('save', function (next) {
  // Re-calculate total value whenever price or stock change
  this.totalValue = this.price * this.stock;
  if (this.stock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock' && this.stock > 0) {
    this.status = 'active';
  }
  next();
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
