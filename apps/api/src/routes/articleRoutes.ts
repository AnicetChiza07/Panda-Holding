import express from 'express';
import {
    getAllArticles,
    getLatestArticles,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle
} from '../controllers/articleController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Routes publiques
router.get('/', getAllArticles);
router.get('/latest', getLatestArticles);
router.get('/:slug', getArticleBySlug);

// Routes protégées (Admin uniquement)
router.post('/', protect, authorize('admin'), createArticle);
router.put('/:id', protect, authorize('admin'), updateArticle);
router.delete('/:id', protect, authorize('admin'), deleteArticle);

export default router;