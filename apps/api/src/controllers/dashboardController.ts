import { Request, Response } from 'express';
import { Article } from '../models/Article';
import { Project } from '../models/Project';
import { Partner } from '../models/Partner';
import { Sector } from '../models'; // Importé depuis l'index qui exporte maintenant le modèle Sector
import { Faq } from '../models/Faq';
import { CarouselSlide } from '../models/CarouselSlide';
import { ContactMessage } from '../models/ContactMessage';

export const getStats = async (req: Request, res: Response) => {
    try {
        const [articles, projects, partners, sectors, faqs, carousel, totalMessages, unreadMessages] = await Promise.all([
            Article.countDocuments(),
            Project.countDocuments(),
            Partner.countDocuments(),
            Sector.countDocuments(),
            Faq.countDocuments(),
            CarouselSlide.countDocuments(),
            ContactMessage.countDocuments(),
            // ⚠️ Si ton champ s'appelle 'lu' ou 'read' au lieu de 'isRead', modifie-le ici
            ContactMessage.countDocuments({ isRead: false }) 
        ]);

        res.status(200).json({
            success: true,
            data: { 
                articles, 
                projects, 
                partners, 
                sectors, 
                faqs, 
                carousel, 
                totalMessages, 
                unreadMessages 
            }
        });
    } catch (error) {
        console.error("❌ ERREUR BACKEND getStats:", error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors du chargement des statistiques' });
    }
};

export const getRecentMessages = async (req: Request, res: Response) => {
    try {
        // Version sécurisée : pas de .select() pour éviter les erreurs si les champs changent
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .limit(5);
            
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("❌ ERREUR BACKEND getRecentMessages:", error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

export const getRecentArticles = async (req: Request, res: Response) => {
    try {
        // ✅ VERSION SÉCURISÉE : Pas de .populate('sector') pour éviter l'erreur StrictPopulateError
        const articles = await Article.find()
            .sort({ createdAt: -1 })
            .limit(5);
            
        res.status(200).json({ success: true, data: articles });
    } catch (error) {
        console.error("❌ ERREUR BACKEND getRecentArticles:", error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

export const getRecentProjects = async (req: Request, res: Response) => {
    try {
        // Version sécurisée : pas de .select() pour éviter les erreurs de champs manquants
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .limit(4);
            
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("❌ ERREUR BACKEND getRecentProjects:", error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};