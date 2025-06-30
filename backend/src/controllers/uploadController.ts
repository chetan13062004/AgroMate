import { Response, Request } from 'express';
import { handleFileUpload, handleMultipleFilesUpload, MulterRequest, UploadedFile, getFileUrl } from '../utils/upload';
import { IUser } from '../models/userModel';
import mongoose from 'mongoose';
import path from 'path';

// Define response types
interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  results?: number;
}

interface FileResponse {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  fieldname: string;
  encoding: string;
}

// Define the extended request type with user
type AuthenticatedRequest = MulterRequest & {
  user?: IUser & { _id: mongoose.Types.ObjectId };
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
};

// Helper function to create file response
const createFileResponse = (file: UploadedFile): FileResponse => ({
  filename: file.filename,
  originalname: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  url: (file as any).url ?? getFileUrl(file.filename),
  fieldname: file.fieldname,
  encoding: file.encoding
});

// Helper function to send response
const sendResponse = <T extends object>(
  res: Response<ApiResponse<T>>,
  status: number,
  data: T | { message: string; status: 'error' },
  results?: number
): void => {
  if ('status' in data && data.status === 'error') {
    res.status(status).json({
      status: 'error',
      message: data.message
    });
  } else {
    const response: ApiResponse<T> = {
      status: 'success',
      data: data as T,
      ...(results !== undefined && { results })
    };
    res.status(status).json(response);
  }
};

// @desc    Upload a single file
// @route   POST /api/upload
// @access  Private
export const uploadFile = async (
  req: Request & AuthenticatedRequest,
  res: Response<ApiResponse<{ file: FileResponse }>>,
  
): Promise<void> => {
  // Type guard to check if user is authenticated
  if (!req.user) {
    return sendResponse(res, 401, { status: 'error', message: 'Not authenticated' });
  }
  
  try {
    // File existence is already checked by the type guard above
    if (!req.file) {
      return sendResponse(res, 400, { status: 'error', message: 'No file provided' });
    }

    try {
      const uploadedFile = await handleFileUpload(req.file);
      const fileResponse = createFileResponse(uploadedFile as unknown as UploadedFile);
      sendResponse(res, 200, { file: fileResponse });
    } catch (error: any) {
      sendResponse(res, 500, {
        status: 'error',
        message: error.message || 'Failed to process file upload'
      });
    }
  } catch (error: any) {
    console.error('Error uploading file:', error);
    
    // Handle specific error cases
    if (error.code === 'LIMIT_FILE_SIZE') {
      sendResponse(res, 400, {
        status: 'error',
        message: 'File too large. Maximum size is 5MB.'
      });
      return;
    }
    
    if (error.code === 'LIMIT_FILE_TYPES') {
      sendResponse(res, 400, {
        status: 'error',
        message: error.message || 'Invalid file type. Only images are allowed.'
      });
      return;
    }
    
    sendResponse(res, 500, {
      status: 'error',
      message: 'Failed to upload file'
    });
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleFiles = async (
  req: Request & AuthenticatedRequest,
  res: Response<ApiResponse<{ files: FileResponse[] }>>,
  
): Promise<void> => {
  // Type guard to check if user is authenticated
  if (!req.user) {
    return sendResponse(res, 401, { status: 'error', message: 'Not authenticated' });
  }
  
  try {
    // Files existence is already checked by the type guard above
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return sendResponse(res, 400, { status: 'error', message: 'No files provided' });
    }

    try {
      const uploadedFiles = await handleMultipleFilesUpload(req.files);
      const fileResponses = uploadedFiles.map(file => 
        createFileResponse(file as unknown as UploadedFile)
      );
      sendResponse(res, 200, { files: fileResponses }, fileResponses.length);
    } catch (error: any) {
      sendResponse(res, 500, {
        status: 'error',
        message: error.message || 'Failed to process file uploads'
      });
    }
  } catch (error: any) {
    console.error('Error uploading files:', error);
    
    // Handle specific error cases
    if (error.code === 'LIMIT_FILE_SIZE') {
      sendResponse(res, 400, {
        status: 'error',
        message: 'One or more files are too large. Maximum size is 5MB per file.'
      });
      return;
    }
    
    if (error.code === 'LIMIT_FILE_TYPES') {
      sendResponse(res, 400, {
        status: 'error',
        message: error.message || 'Invalid file type. Only images are allowed.'
      });
      return;
    }
    
    sendResponse(res, 500, {
      status: 'error',
      message: 'Failed to upload files'
    });
  }
};

// @desc    Delete a file
// @route   DELETE /api/upload/:filename
// @access  Private
export const deleteFile = async (
  req: Request & AuthenticatedRequest,
  res: Response<ApiResponse<Record<string, never>>>,
  
): Promise<void> => {
  // Type guard to check if user is authenticated
  if (!req.user) {
    return sendResponse(res, 401, { status: 'error', message: 'Not authenticated' });
  }
  const { filename } = req.params;
  const fs = require('fs').promises;
  
  // Validate filename type
  if (typeof filename !== 'string' || !filename) {
    return sendResponse(res, 400, { status: 'error', message: 'Invalid filename' });
  }
  
  // Validate filename format and prevent directory traversal
  if (
    filename.includes('..') ||
    filename.includes('/') ||
    filename.includes('\\') ||
    !/^[a-zA-Z0-9-_.]+$/.test(filename)
  ) {
    return sendResponse(res, 400, {
      status: 'error',
      message: 'Invalid filename'
    });
  }
  
  const filePath = path.join(__dirname, '../../uploads', filename);
  
  try {
    try {
      // Check if file exists
      await fs.access(filePath);
      
      // Delete the file
      await fs.unlink(filePath);
      
      sendResponse(res, 200, {});
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        sendResponse(res, 404, {
          status: 'error',
          message: 'File not found'
        });
      } else {
        sendResponse(res, 500, {
          status: 'error',
          message: 'Failed to delete file'
        });
      }
    }
  } catch (error: any) {
    console.error('Error deleting file:', error);
    
    if (error.code === 'ENOENT') {
      sendResponse(res, 404, {
        status: 'error',
        message: 'File not found'
      });
      return;
    }
    
    sendResponse(res, 500, {
      status: 'error',
      message: 'Failed to delete file'
    });
  }
};
