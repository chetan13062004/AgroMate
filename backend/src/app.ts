import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';


import path from 'path';
import { globalErrorHandler } from './utils/errorHandler';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminOrderRoutes from './routes/adminOrderRoutes';
import adminUserRoutes from './routes/adminUserRoutes';
import farmerRoutes from './routes/farmerRoutes';
import wishlistRoutes from './routes/wishlistRoutes.js';
import userRoutes from './routes/userRoutes';

const app = express();

// 1) GLOBAL MIDDLEWARES
// Enable CORS with more specific configuration
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    // Allow requests from the frontend origin
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    // Allow credentials (cookies, authorization headers)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Allow specific headers
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN'
    );
    
    // Allow specific methods
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
      res.status(204).end();
      return;
    }
    
    next();
  } catch (error) {
    console.error('CORS error:', error);
    next(error);
  }
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files for product images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(cookieParser());


// 2) ROUTES
app.get('/', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', require('./routes/cartRoutes').default);
app.use('/api/orders', require('./routes/orderRoutes').default);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);

// 3) ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// 4) HANDLE UNHANDLED ROUTES
app.all('*', (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
