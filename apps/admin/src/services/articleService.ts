import api from './api';
import type { Article, CreateArticleDTO } from '../types/article';

export const articleService = {
    getAll: async (): Promise<Article[]> => {
        const response = await api.get<{ success: boolean; data: Article[] }>('/articles');
        return response.data.data;
    },

    getById: async (id: string): Promise<Article> => {
        const response = await api.get<{ success: boolean; data: Article }>(`/articles/${id}`);
        return response.data.data;
    },

    create: async (data: CreateArticleDTO): Promise<Article> => {
        const response = await api.post<{ success: boolean; data: Article }>('/articles', data);
        return response.data.data;
    },

    update: async (id: string, data: Partial<CreateArticleDTO>): Promise<Article> => {
        const response = await api.put<{ success: boolean; data: Article }>(`/articles/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/articles/${id}`);
    },
};