import express from 'express';
import { getStats, getRecentMessages, getRecentArticles, getRecentProjects } from '../controllers/dashboardController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Toutes les routes du dashboard sont protégées
router.use(protect);

router.get('/stats', getStats);
router.get('/recent-messages', getRecentMessages);
router.get('/recent-articles', getRecentArticles);
router.get('/recent-projects', getRecentProjects);

export default router;