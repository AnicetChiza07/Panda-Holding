import api from './api';

// ✅ 1. Mise à jour de la structure pour correspondre EXACTEMENT au backend
export interface DashboardStats {
    articles: { total: number; active: number };
    carousel: { total: number; active: number };
    partners: { total: number; active: number };
    sectors: { total: number; active: number };
    projects: { total: number; active: number };
    testimonials: { total: number; active: number }; // ✅ Ajouté
    messages: { total: number; unread: number };
    users: { total: number };
}

export interface RecentMessage {
    _id: string;
    name?: string;
    email?: string;
    subject?: string;
    isRead: boolean;
    createdAt: string;
}

export interface RecentArticle {
    _id: string;
    title?: string;
    // ✅ Typage propre pour éviter le 'any'
    sector?: { _id: string; name: string } | string; 
    isFeatured?: boolean;
    createdAt: string;
}

export interface RecentProject {
    _id: string;
    title?: string;
    description?: string;
    coverImage?: string;
    createdAt: string;
}

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data; // Renvoie { success: true, data: { stats: {...}, recentArticles: [...] } }
    },
    getRecentMessages: async () => {
        const response = await api.get('/dashboard/recent-messages');
        return response.data; // Renvoie { success: true, data: [...] }
    },
    getRecentArticles: async () => {
        const response = await api.get('/dashboard/recent-articles');
        return response.data;
    },
    getRecentProjects: async () => {
        const response = await api.get('/dashboard/recent-projects');
        return response.data;
    }
};