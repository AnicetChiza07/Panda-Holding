import { Request, Response } from 'express';
import { Project } from '../models/Project'; // Vérifiez le chemin d'import

// @desc    Récupérer tous les projets (Admin a besoin de voir actifs ET inactifs)
// @route   GET /api/projects
// @access  Admin
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        // ✅ Suppression du filtre { isActive: true }
        const projects = await Project.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        console.error("Erreur getAllProjects:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Récupérer un projet par slug (Public)
// @route   GET /api/projects/:slug
// @access  Public
export const getProjectBySlug = async (req: Request, res: Response) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug, isActive: true });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Erreur getProjectBySlug:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Créer un nouveau projet
// @route   POST /api/projects
// @access  Admin
export const createProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, message: 'Projet créé avec succès', data: project });
    } catch (error) {
        console.error("Erreur createProject:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Mettre à jour un projet
// @route   PUT /api/projects/:id
// @access  Admin
export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        }

        res.status(200).json({ success: true, message: 'Projet mis à jour avec succès', data: project });
    } catch (error) {
        console.error("Erreur updateProject:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Supprimer un projet (Suppression DÉFINITIVE)
// @route   DELETE /api/projects/:id
// @access  Admin
export const deleteProject = async (req: Request, res: Response) => {
    try {
        // ✅ CHANGEMENT ICI : Suppression physique de la base de données
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        }

        res.status(200).json({ success: true, message: 'Projet supprimé définitivement' });
    } catch (error) {
        console.error("Erreur deleteProject:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};