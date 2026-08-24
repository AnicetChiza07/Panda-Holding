import { Request, Response } from 'express';
import { Faq } from '../models/Faq';

// @desc    Récupérer toutes les FAQ (Admin voit actifs ET inactifs)
// @route   GET /api/faqs
// @access  Admin
export const getAllFaqs = async (req: Request, res: Response) => {
    try {
        // ✅ Tri par ordre, puis par date de création
        const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs
        });
    } catch (error) {
        console.error("Erreur getAllFaqs:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Créer une nouvelle FAQ
// @route   POST /api/faqs
// @access  Admin
export const createFaq = async (req: Request, res: Response) => {
    try {
        console.log("📥 Données reçues pour création FAQ:", req.body); // <-- Affiche ce qu'on envoie
        
        const faq = await Faq.create(req.body);
        res.status(201).json({ success: true, message: 'FAQ créée avec succès', data: faq });
    } catch (error: any) {
        console.error("❌ Erreur détaillée createFaq:", error);
        
        // ✅ Si c'est une erreur de validation Mongoose, on extrait le message exact
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation : ' + messages.join(', '),
                details: error.errors
            });
        }

        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Mettre à jour une FAQ
// @route   PUT /api/faqs/:id
// @access  Admin
export const updateFaq = async (req: Request, res: Response) => {
    try {
        const faq = await Faq.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ non trouvée' });
        }

        res.status(200).json({ success: true, message: 'FAQ mise à jour', data: faq });
    } catch (error) {
        console.error("Erreur updateFaq:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Supprimer une FAQ (Suppression DÉFINITIVE)
// @route   DELETE /api/faqs/:id
// @access  Admin
export const deleteFaq = async (req: Request, res: Response) => {
    try {
        // ✅ Suppression physique (Hard Delete)
        const faq = await Faq.findByIdAndDelete(req.params.id);

        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ non trouvée' });
        }

        res.status(200).json({ success: true, message: 'FAQ supprimée définitivement' });
    } catch (error) {
        console.error("Erreur deleteFaq:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};