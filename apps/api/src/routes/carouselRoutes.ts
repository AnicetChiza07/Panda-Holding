import express from 'express';
import {
    getAllSlides,
    createSlide,
    updateSlide,
    deleteSlide
} from '../controllers/carouselController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/', getAllSlides);

router.post('/', protect, authorize('admin'), createSlide);
router.put('/:id', protect, authorize('admin'), updateSlide);
router.delete('/:id', protect, authorize('admin'), deleteSlide);

export default router;