import express from 'express';
import {
    submitContactForm,
    getAllMessages,
    getMessageById,
    markAsRead,
    deleteMessage
} from '../controllers/contactController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Route publique
router.post('/', submitContactForm);

// ✅ Routes Admin : on garde '/messages' pour matcher le frontend
router.get('/messages', protect, authorize('admin'), getAllMessages);
router.get('/messages/:id', protect, authorize('admin'), getMessageById);
router.put('/messages/:id/read', protect, authorize('admin'), markAsRead);
router.delete('/messages/:id', protect, authorize('admin'), deleteMessage);

export default router;