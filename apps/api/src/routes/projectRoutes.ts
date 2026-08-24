import express from 'express';
import {
    getAllProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/projectController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);

router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;