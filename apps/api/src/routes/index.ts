import express from 'express';
import authRoutes from './authRoutes';
import sectorRoutes from './sectorRoutes';
import articleRoutes from './articleRoutes';
import projectRoutes from './projectRoutes';
import partnerRoutes from './partnerRoutes';
import faqRoutes from './faqRoutes';
import carouselRoutes from './carouselRoutes';
import contactRoutes from './contactRoutes';
import uploadRoutes from './uploadRoutes';
import userRoutes from './userRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/sectors', sectorRoutes);
router.use('/articles', articleRoutes);
router.use('/projects', projectRoutes);
router.use('/partners', partnerRoutes);
router.use('/faqs', faqRoutes);
router.use('/carousel', carouselRoutes);
router.use('/contact', contactRoutes);
router.use('/upload', uploadRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;