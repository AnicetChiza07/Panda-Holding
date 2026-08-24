import { Request, Response } from 'express';
import { ContactMessage } from '../models';

// @desc    Soumettre un message via le formulaire de contact (Public)
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const message = await ContactMessage.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Message envoyé avec succès',
            data: message
        });
    } catch (error) {
        console.error("Erreur submitContactForm:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'envoi',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Récupérer tous les messages (Non-lus en premier, puis par date)
// @route   GET /api/messages
// @access  Admin
export const getAllMessages = async (req: Request, res: Response) => {
    try {
        // ✅ Tri corrigé : isRead ascendant (false=0 avant true=1), puis createdAt descendant
        const messages = await ContactMessage.find().sort({ isRead: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error("Erreur getAllMessages:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Récupérer un message par ID
// @route   GET /api/messages/:id
// @access  Admin
export const getMessageById = async (req: Request, res: Response) => {
    try {
        const message = await ContactMessage.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error("Erreur getMessageById:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Marquer un message comme lu
// @route   PUT /api/messages/:id/read
// @access  Admin
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message marqué comme lu',
            data: message
        });
    } catch (error) {
        console.error("Erreur markAsRead:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Supprimer un message (Suppression DÉFINITIVE)
// @route   DELETE /api/messages/:id
// @access  Admin
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        // ✅ Suppression physique (Hard Delete)
        const message = await ContactMessage.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message supprimé définitivement'
        });
    } catch (error) {
        console.error("Erreur deleteMessage:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};