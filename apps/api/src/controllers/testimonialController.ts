import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial';

// Récupérer tous les témoignages actifs (pour le frontend)
export const getActiveTestimonials = async (req: Request, res: Response) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .select('name role company image content rating order');

        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        console.error('Erreur backend récupération témoignages actifs:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des témoignages'
        });
    }
};

// Récupérer tous les témoignages (pour l'admin)
export const getAllTestimonials = async (req: Request, res: Response) => {
    try {
        const testimonials = await Testimonial.find()
            .sort({ order: 1, createdAt: -1 })
            .select('name role company image content rating order isActive');

        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        console.error('Erreur backend récupération tous les témoignages:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des témoignages'
        });
    }
};

// Créer un témoignage
export const createTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.create(req.body);

        res.status(201).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Erreur backend création témoignage:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du témoignage'
        });
    }
};

// Mettre à jour un témoignage
export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Témoignage non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Erreur backend mise à jour témoignage:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du témoignage'
        });
    }
};

// Supprimer un témoignage
export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Témoignage non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Témoignage supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur backend suppression témoignage:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du témoignage'
        });
    }
};