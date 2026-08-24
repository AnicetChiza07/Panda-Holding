import express from 'express';
import {
    getAllSectors,
    getSectorBySlug,
    createSector,
    updateSector,
    deleteSector
} from '../controllers/sectorController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Routes publiques
router.get('/', getAllSectors);
router.get('/:slug', getSectorBySlug);

// Routes protégées (Admin uniquement)
router.post('/', protect, authorize('admin'), createSector);
router.put('/:id', protect, authorize('admin'), updateSector);
router.delete('/:id', protect, authorize('admin'), deleteSector);

export default router;