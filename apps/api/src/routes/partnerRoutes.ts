import express from 'express';
import {
    getAllPartners,
    createPartner,
    updatePartner,
    deletePartner
} from '../controllers/partnerController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/', getAllPartners);

router.post('/', protect, authorize('admin'), createPartner);
router.put('/:id', protect, authorize('admin'), updatePartner);
router.delete('/:id', protect, authorize('admin'), deletePartner);

export default router;