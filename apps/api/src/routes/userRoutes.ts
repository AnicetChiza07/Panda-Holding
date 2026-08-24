import express from 'express';
import { getMe, updateProfile, changePassword } from '../controllers/userController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Toutes les routes de ce fichier nécessitent une authentification
router.use(protect);

router.get('/me', getMe);
router.put('/me', updateProfile);
router.put('/change-password', changePassword);

export default router;