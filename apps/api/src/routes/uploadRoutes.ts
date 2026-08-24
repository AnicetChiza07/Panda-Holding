import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController';
import { upload } from '../middlewares/upload';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.post('/single', protect, authorize('admin'), upload.single('image'), uploadImage);
router.post('/multiple', protect, authorize('admin'), upload.array('images', 10), uploadMultipleImages);

export default router;