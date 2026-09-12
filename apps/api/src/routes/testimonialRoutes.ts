import express from 'express';
import {
    getActiveTestimonials,
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} from '../controllers/testimonialController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Routes publiques (frontend)
router.get('/active', getActiveTestimonials);

// Routes protégées (admin)
router.get('/', protect, getAllTestimonials);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;