import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const connectDB = async (): Promise<void> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    if (error instanceof Error) {
      console.error(`- ${error.name}: ${error.message}`);
      if ('code' in error) {
        console.error(`- Error code: ${error.code}`);
      }
    } else {
      console.error('- Unknown error occurred');
    }
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Is MongoDB running locally? Try: mongod --version');
    console.log('2. Check if the connection string is correct');
    console.log('3. Is the database server accessible?');
    process.exit(1);
  }
};

export default connectDB;
