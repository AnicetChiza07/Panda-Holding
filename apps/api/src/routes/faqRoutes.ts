import express from 'express';
import {
    getAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq
} from '../controllers/faqController'; // ✅ Correction ici : on importe le contrôleur FAQ
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// ✅ Routes publiques ou protégées selon tes besoins (ici protégées pour l'admin)
router.get('/', getAllFaqs);

router.post('/', protect, authorize('admin'), createFaq);
router.put('/:id', protect, authorize('admin'), updateFaq);
router.delete('/:id', protect, authorize('admin'), deleteFaq);

export default router;