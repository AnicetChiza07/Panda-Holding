import api from './api';

export interface DashboardStats {
    articles: number;
    projects: number;
    partners: number;
    sectors: number;
    faqs: number;
    carousel: number;
    totalMessages: number;
    unreadMessages: number;
}

export interface RecentMessage {
    _id: string;
    name?: string;
    email?: string;
    subject?: string;
    isRead?: boolean;
    createdAt: string;
}

export interface RecentArticle {
    _id: string;
    title?: string;
    sector?: { name?: string } | string; 
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
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
        return response.data.data;
    },
    getRecentMessages: async (): Promise<RecentMessage[]> => {
        const response = await api.get<{ success: boolean; data: RecentMessage[] }>('/dashboard/recent-messages');
        return response.data.data;
    },
    getRecentArticles: async (): Promise<RecentArticle[]> => {
        const response = await api.get<{ success: boolean; data: RecentArticle[] }>('/dashboard/recent-articles');
        return response.data.data;
    },
    getRecentProjects: async (): Promise<RecentProject[]> => {
        const response = await api.get<{ success: boolean; data: RecentProject[] }>('/dashboard/recent-projects');
        return response.data.data;
    },
};