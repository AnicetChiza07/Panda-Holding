import { Request, Response } from 'express';
import { CarouselSlide } from '../models';

// @desc    Récupérer toutes les slides (Admin voit actives ET inactives)
// @route   GET /api/carousel
// @access  Admin
export const getAllSlides = async (req: Request, res: Response) => {
    try {
        // ✅ Suppression du filtre { isActive: true } pour que l'admin voie tout
        const slides = await CarouselSlide.find().sort({ order: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: slides.length,
            data: slides
        });
    } catch (error) {
        console.error("Erreur getAllSlides:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Créer une nouvelle slide
// @route   POST /api/carousel
// @access  Admin
export const createSlide = async (req: Request, res: Response) => {
    try {
        const slide = await CarouselSlide.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Slide créée avec succès',
            data: slide
        });
    } catch (error) {
        console.error("Erreur createSlide:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Mettre à jour une slide
// @route   PUT /api/carousel/:id
// @access  Admin
export const updateSlide = async (req: Request, res: Response) => {
    try {
        const slide = await CarouselSlide.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Slide non trouvée'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Slide mise à jour avec succès',
            data: slide
        });
    } catch (error) {
        console.error("Erreur updateSlide:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Supprimer une slide (Suppression DÉFINITIVE)
// @route   DELETE /api/carousel/:id
// @access  Admin
export const deleteSlide = async (req: Request, res: Response) => {
    try {
        // ✅ CHANGEMENT ICI : Suppression physique au lieu de soft delete
        const slide = await CarouselSlide.findByIdAndDelete(req.params.id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Slide non trouvée'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Slide supprimée définitivement'
        });
    } catch (error) {
        console.error("Erreur deleteSlide:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};