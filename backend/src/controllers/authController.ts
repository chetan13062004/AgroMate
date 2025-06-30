import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/userModel';
import { notifyAdminOfNewFarmer } from '../utils/emailService';
import { CustomError } from '../utils/errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Generate JWT Token
const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  // Support both numeric seconds (e.g. 2592000) and duration strings like '30d', '24h'
  const expiresInEnv = process.env.JWT_EXPIRES_IN;
  const expiresInOption = expiresInEnv && expiresInEnv.trim() !== '' ? expiresInEnv : '30d';

  // Type assertion ensures the secret is treated as a non-nullable string acceptable by jsonwebtoken
  const secretKey = process.env.JWT_SECRET as string;
  const signOptions: SignOptions = {
    // The type definition for SignOptions expects number | StringValue. We cast here to satisfy the type checker while
    // still allowing convenient duration strings (e.g. '30d') that `jsonwebtoken` supports at runtime.
    expiresIn: expiresInOption as unknown as number,
  };
  return jwt.sign({ id }, secretKey, signOptions);

};

// Send JWT Token via Cookie
const sendToken = (user: IUser, statusCode: number, res: Response): void => {
  try {
    console.log('Generating JWT token for user:', user._id);
    const userId = user._id.toString();
    const token = generateToken(userId);
    
    // Calculate expiration time (default: 30 days)
    const expiresInDays = process.env.JWT_COOKIE_EXPIRES_IN 
      ? parseInt(process.env.JWT_COOKIE_EXPIRES_IN) 
      : 30;
    
    const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;
    const expiresDate = new Date(Date.now() + expiresInMs);
    
    const cookieOptions = {
      expires: expiresDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
    };

    console.log('Cookie options:', {
      expires: cookieOptions.expires,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      domain: cookieOptions.domain,
    });

    // Remove password and other sensitive fields from output
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;
    delete userObj.createdAt;
    delete userObj.updatedAt;

    // Set JWT in HTTP-only cookie
    res.cookie('jwt', token, cookieOptions);
    
    // Send response including the JWT so that SPA clients can persist it (in addition to the http-only cookie)
    res.status(statusCode).json({
      status: 'success',
      token, // expose token for clients that store it in localStorage / memory
      data: {
        user: userObj,
        token, // also nested for legacy callers expecting it under data
      },
    });
    
    console.log('Successfully sent token via cookie and response');
  } catch (error) {
    console.error('Error in sendToken:', error);
    throw error; // This will be caught by the global error handler
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('\n=== Registration Attempt ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { name, email, password, role, location, avatar } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Validation failed: Missing required fields');
      return next(new CustomError('Please provide all required fields', 400));
    }

    // Check if user already exists
    console.log(`Checking if user exists with email: ${email}`);
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists');
      return next(new CustomError('User already exists with this email', 400));
    }

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
      isApproved: (role || 'buyer') !== 'farmer',
      ...(location && { location }),
      ...(avatar && { avatar }),
    });

    console.log('User created successfully:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Notify admin if the new user is a farmer and requires approval
    if (user.role === 'farmer' && !user.isApproved) {
      try {
        await notifyAdminOfNewFarmer(user);
        console.log('Admin notified about new farmer registration');
      } catch (emailErr) {
        console.error('Failed to send admin notification email', emailErr);
      }
    }

    sendToken(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('\n=== Login Attempt ===');
    console.log('Request body:', { email: req.body.email });
    
    // Normalize inputs to avoid case or whitespace discrepancies
    let { email, password } = req.body as { email: string; password: string };
    email = email?.trim().toLowerCase();
    password = password?.trim();

    // 1) Check if email and password exist
    if (!email || !password) {
      console.log('Login failed: Email or password not provided');
      return next(new CustomError('Please provide email and password', 400));
    }

    // 2) Check if user exists
    console.log(`Looking up user with email: ${email}`);
    const user = await User.findOne({ email }).select('+password');
    // Ensure farmer accounts are approved before allowing login
    if (user && user.role === 'farmer' && !user.isApproved) {
      console.log('Login failed: Farmer account not approved yet');
      return next(new CustomError('Your account is pending admin approval', 401));
    }
    
    if (!user) {
      console.log('Login failed: No user found with this email');
      return next(new CustomError('Incorrect email or password', 401));
    }

    // 3) Check if password is correct
    console.log('Comparing passwords...');
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      console.log('Login failed: Incorrect password');
      return next(new CustomError('Incorrect email or password', 401));
    }

    console.log('Login successful, sending token...');
    
    // 4) If everything ok, send token to client
    sendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    next(new CustomError('An error occurred during login', 500));
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = (_req: Request, res: Response): void => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('getMe - Request user:', req.user);
    
    if (!req.user) {
      console.error('getMe - No user in request');
      return next(new CustomError('Not authorized to access this route', 401));
    }
    
    // Fetch the latest user data from database
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      console.error('getMe - User not found in database:', req.user._id);
      return next(new CustomError('User not found', 404));
    }
    
    console.log('getMe - Found user:', { id: user._id, email: user.email });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          // Add other non-sensitive fields as needed
        },
      },
    });
  } catch (error) {
    console.error('getMe - Error:', error);
    next(new CustomError('Error fetching user data', 500));
  }
};
