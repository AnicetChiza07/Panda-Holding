import { Request, Response } from 'express';
import { Article } from '../models/Article'; // Assurez-vous que le chemin est correct

// @desc    Récupérer tous les articles
// @route   GET /api/articles
// @access  Public
export const getAllArticles = async (req: Request, res: Response) => {
    try {
        // ✅ Récupère la limite depuis l'URL (défaut 50) pour éviter de surcharger la DB
        const limit = parseInt(req.query.limit as string) || 50;
        
        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error("ERREUR BACKEND getAllArticles:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Récupérer les 3 derniers articles (pour la page d'accueil publique)
// @route   GET /api/articles/latest
// @access  Public
export const getLatestArticles = async (req: Request, res: Response) => {
    try {
        const articles = await Article.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(3);
        
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error("Erreur getLatestArticles:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Récupérer un article par slug (Public)
// @route   GET /api/articles/:slug
// @access  Public
export const getArticleBySlug = async (req: Request, res: Response) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug, isActive: true });

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error("Erreur getArticleBySlug:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Créer un nouvel article
// @route   POST /api/articles
// @access  Admin
export const createArticle = async (req: Request, res: Response) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Article créé avec succès',
            data: article
        });
    } catch (error) {
        console.error("Erreur createArticle:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Mettre à jour un article
// @route   PUT /api/articles/:id
// @access  Admin
export const updateArticle = async (req: Request, res: Response) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: article
        });
    } catch (error) {
        console.error("Erreur updateArticle:", error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

// @desc    Supprimer un article (Suppression définitive)
// @route   DELETE /api/articles/:id
// @access  Admin
export const deleteArticle = async (req: Request, res: Response) => {
    try {
        // ✅ CHANGEMENT ICI : findByIdAndDelete au lieu de findByIdAndUpdate
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article supprimé définitivement'
        });
    } catch (error) {
        console.error("Erreur deleteArticle:", error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};