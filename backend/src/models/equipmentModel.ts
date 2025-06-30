import mongoose, { Document, Schema } from 'mongoose';

export interface IEquipment extends Document {
  equipmentName: string;
  equipmentType: string; // Tractor, Tiller, etc.
  brand: string;
  modelNumber: string;
  condition: string; // New, Good, Average
  fuelType: string; // Diesel, Petrol, Manual
  rentalPrice: number;
  minRentalDuration: number; // in days
  maxRentalDuration?: number; // optional, in days
  availabilityStartDate: Date;
  availabilityEndDate: Date;
  pickupMethod: string; // Self-pickup, Delivery available
  images: string[]; // stored image URLs/paths
  owner: mongoose.Types.ObjectId; // Farmer who listed the equipment
  createdAt: Date;
  updatedAt: Date;
}

const equipmentSchema = new Schema<IEquipment>(
  {
    equipmentName: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },
    equipmentType: {
      type: String,
      required: [true, 'Equipment type is required'],
      enum: {
        values: ['Tractor', 'Tiller', 'Sprayer', 'Seeder', 'Harvester', 'Plough', 'Other'],
        message: 'Invalid equipment type',
      },
    },
    brand: {
      type: String,
      required: [true, 'Brand/Manufacturer is required'],
    },
    modelNumber: {
      type: String,
      required: [true, 'Model number is required'],
    },
    condition: {
      type: String,
      enum: ['New', 'Good', 'Average'],
      default: 'Good',
      required: [true, 'Equipment condition is required'],
    },
    fuelType: {
      type: String,
      enum: ['Diesel', 'Petrol', 'Manual'],
      required: [true, 'Fuel type is required'],
    },
    rentalPrice: {
      type: Number,
      required: [true, 'Rental price is required'],
      min: [0, 'Rental price must be positive'],
    },
    minRentalDuration: {
      type: Number,
      required: [true, 'Minimum rental duration is required'],
      min: [1, 'Minimum rental duration must be at least 1 day'],
    },
    maxRentalDuration: {
      type: Number,
      min: [1, 'Maximum rental duration must be at least 1 day'],
    },
    availabilityStartDate: {
      type: Date,
      required: [true, 'Availability start date is required'],
    },
    availabilityEndDate: {
      type: Date,
      required: [true, 'Availability end date is required'],
      validate: {
        validator: function (this: IEquipment, value: Date) {
          return value >= this.availabilityStartDate;
        },
        message: 'End date must be after start date',
      },
    },
    pickupMethod: {
      type: String,
      enum: ['Self-pickup', 'Delivery available'],
      required: [true, 'Pickup method is required'],
    },
    images: {
      type: [String],
      validate: {
        validator: (arr: string[]) => arr.length >= 1 && arr.length <= 4,
        message: 'You must upload between 1 and 4 images',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner (farmer) ID is required'],
    },
  },
  { timestamps: true }
);

const Equipment = mongoose.model<IEquipment>('Equipment', equipmentSchema);
export default Equipment;
