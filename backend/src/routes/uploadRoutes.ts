import express from 'express';
import { uploadFile, uploadMultipleFiles, deleteFile } from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
import { uploadSingle, uploadMultiple } from '../utils/upload';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Upload a single file
router.post('/', uploadSingle('file'), uploadFile);

// Upload multiple files
router.post('/multiple', uploadMultiple('files', 5), uploadMultipleFiles);

// Delete a file
router.delete('/:filename', deleteFile);

export default router;
