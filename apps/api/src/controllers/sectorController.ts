import { Request, Response } from 'express';
import { Sector } from '../models/Sector';

// @desc    Récupérer tous les secteurs (Admin a besoin de voir les actifs ET inactifs)
// @route   GET /api/sectors
// @access  Admin
export const getAllSectors = async (req: Request, res: Response) => {
    try {
        const sectors = await Sector.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: sectors.length,
            data: sectors
        });
    } catch (error) {
        console.error("Erreur getAllSectors:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Récupérer un secteur par slug
// @route   GET /api/sectors/:slug
// @access  Public
export const getSectorBySlug = async (req: Request, res: Response) => {
    try {
        const sector = await Sector.findOne({ slug: req.params.slug, isActive: true });

        if (!sector) {
            return res.status(404).json({
                success: false,
                message: 'Secteur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            data: sector
        });
    } catch (error) {
        console.error("Erreur getSectorBySlug:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Créer un nouveau secteur
// @route   POST /api/sectors
// @access  Admin
export const createSector = async (req: Request, res: Response) => {
    try {
        const sector = await Sector.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Secteur créé avec succès',
            data: sector
        });
    } catch (error) {
        console.error("Erreur createSector:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Mettre à jour un secteur
// @route   PUT /api/sectors/:id
// @access  Admin
export const updateSector = async (req: Request, res: Response) => {
    try {
        const sector = await Sector.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!sector) {
            return res.status(404).json({
                success: false,
                message: 'Secteur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Secteur mis à jour avec succès',
            data: sector
        });
    } catch (error) {
        console.error("Erreur updateSector:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Supprimer un secteur (Suppression définitive)
// @route   DELETE /api/sectors/:id
// @access  Admin
export const deleteSector = async (req: Request, res: Response) => {
    try {
        // ✅ CHANGEMENT ICI : findByIdAndDelete au lieu de findByIdAndUpdate
        const sector = await Sector.findByIdAndDelete(req.params.id);

        if (!sector) {
            return res.status(404).json({
                success: false,
                message: 'Secteur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Secteur supprimé définitivement'
        });
    } catch (error) {
        console.error("Erreur deleteSector:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};