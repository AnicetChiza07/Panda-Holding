import { Request, Response } from 'express';
import { Partner } from '../models/Partner'; // Vérifiez le chemin d'import

// @desc    Récupérer tous les partenaires (Admin voit actifs ET inactifs)
// @route   GET /api/partners
// @access  Admin
export const getAllPartners = async (req: Request, res: Response) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: partners.length,
            data: partners
        });
    } catch (error) {
        console.error("Erreur getAllPartners:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Créer un nouveau partenaire
// @route   POST /api/partners
// @access  Admin
export const createPartner = async (req: Request, res: Response) => {
    try {
        const partner = await Partner.create(req.body);
        res.status(201).json({ success: true, message: 'Partenaire ajouté avec succès', data: partner });
    } catch (error) {
        console.error("Erreur createPartner:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Mettre à jour un partenaire
// @route   PUT /api/partners/:id
// @access  Admin
export const updatePartner = async (req: Request, res: Response) => {
    try {
        const partner = await Partner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partenaire non trouvé' });
        }

        res.status(200).json({ success: true, message: 'Partenaire mis à jour', data: partner });
    } catch (error) {
        console.error("Erreur updatePartner:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Supprimer un partenaire (Suppression DÉFINITIVE)
// @route   DELETE /api/partners/:id
// @access  Admin
export const deletePartner = async (req: Request, res: Response) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partenaire non trouvé' });
        }

        res.status(200).json({ success: true, message: 'Partenaire supprimé définitivement' });
    } catch (error) {
        console.error("Erreur deletePartner:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};