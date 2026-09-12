import { Request, Response } from 'express';
import { Article } from '../models/Article';
import { CarouselSlide } from '../models/CarouselSlide';
import { Partner } from '../models/Partner';
import { Sector } from '../models/Sector';
import { Project } from '../models/Project';
import { ContactMessage } from '../models/ContactMessage';
import { User } from '../models/User';
import { Testimonial } from '../models/Testimonial';

// ✅ 1. Renommé de getDashboardStats à getStats pour correspondre aux routes
export const getStats = async (req: Request, res: Response) => {
    try {
        // Compter les documents dans chaque collection
        const totalArticles = await Article.countDocuments();
        const totalCarouselSlides = await CarouselSlide.countDocuments();
        const totalPartners = await Partner.countDocuments();
        const totalSectors = await Sector.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalContactMessages = await ContactMessage.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalTestimonials = await Testimonial.countDocuments(); // ✅ Ajouté

        // Compter les éléments actifs
        const activeArticles = await Article.countDocuments({ isActive: true });
        const activeCarouselSlides = await CarouselSlide.countDocuments({ isActive: true });
        const activePartners = await Partner.countDocuments({ isActive: true });
        const activeSectors = await Sector.countDocuments({ isActive: true });
        const activeProjects = await Project.countDocuments({ isActive: true });
        const activeTestimonials = await Testimonial.countDocuments({ isActive: true }); // ✅ Ajouté

        // Compter les messages non lus
        const unreadMessages = await ContactMessage.countDocuments({ isRead: false });

        // Récupérer les 5 derniers articles
        const recentArticles = await Article.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title slug createdAt isActive');

        // Récupérer les 5 derniers messages de contact
        const recentMessages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email subject createdAt isRead');

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    articles: { total: totalArticles, active: activeArticles },
                    carousel: { total: totalCarouselSlides, active: activeCarouselSlides },
                    partners: { total: totalPartners, active: activePartners },
                    sectors: { total: totalSectors, active: activeSectors },
                    projects: { total: totalProjects, active: activeProjects },
                    testimonials: { total: totalTestimonials, active: activeTestimonials }, // ✅ Ajouté
                    messages: { total: totalContactMessages, unread: unreadMessages },
                    users: { total: totalUsers }
                },
                recentArticles,
                recentMessages
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
};

// ✅ 2. Fonctions manquantes requises par dashboardRoutes.ts
export const getRecentMessages = async (req: Request, res: Response) => {
    try {
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email subject message createdAt isRead');
            
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages' });
    }
};

export const getRecentArticles = async (req: Request, res: Response) => {
    try {
        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title slug createdAt isActive');
            
        res.status(200).json({ success: true, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des articles' });
    }
};

export const getRecentProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title slug createdAt isActive');
            
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des projets' });
    }
};