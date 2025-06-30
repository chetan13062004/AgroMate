import multer, { FileFilterCallback, diskStorage, StorageEngine } from 'multer';
import { Request } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { promisify } from 'util';

// Extend the Express Request type to include the file and files properties
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}

// Define a custom File type that matches our needs
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

const mkdir = promisify(fs.mkdir);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  mkdir(uploadDir, { recursive: true });
}

// Configure storage with proper typing
const storage: StorageEngine = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// File filter to only allow images
const fileFilter = (
  _req: Request, 
  file: Express.Multer.File, 
  cb: FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.') as Error & { code?: string };
    error.code = 'LIMIT_FILE_TYPES';
    cb(error);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware for single file upload
export const uploadSingle = (fieldName: string) => 
  upload.single(fieldName);

// Middleware for multiple files upload
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => 
  upload.array(fieldName, maxCount);

// Base URL for constructing absolute file URLs
const BASE_URL = process.env.BASE_URL || process.env.SERVER_URL || 'http://localhost:5000';

// Get file URL (absolute)
export const getFileUrl = (filename: string) => {
  return `${BASE_URL}/uploads/${filename}`;
};

// Handle single file upload
export const handleFileUpload = async (file: Express.Multer.File): Promise<{
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}> => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Type assertion to access diskStorage properties
  const uploadedFile = file as unknown as UploadedFile;

  return {
    filename: uploadedFile.filename,
    originalname: uploadedFile.originalname,
    mimetype: uploadedFile.mimetype,
    size: uploadedFile.size,
    url: getFileUrl(uploadedFile.filename),
  };
};

// Handle multiple files upload
export const handleMultipleFilesUpload = async (files: Express.Multer.File[]): Promise<Array<{
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}>> => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  return files.map(file => {
    // Type assertion to access diskStorage properties
    const uploadedFile = file as unknown as UploadedFile;
    
    return {
      filename: uploadedFile.filename,
      originalname: uploadedFile.originalname,
      mimetype: uploadedFile.mimetype,
      size: uploadedFile.size,
      url: getFileUrl(uploadedFile.filename),
    };
  });
};
