import express from 'express';
import { login, setupAdmin } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/setup', setupAdmin);

export default router;