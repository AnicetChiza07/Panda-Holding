import api from './api';

export interface ApiArticle {
    _id: string;
    slug?: string;
    title: string;
    excerpt?: string;
    description?: string;
    category?: string;
    sector?: { name: string };
    isFeatured?: boolean;
    coverImage?: string;
    image?: string;
    author?: string;
    authorRole?: string;       // ✅ AJOUTÉ
    readTime?: string;
    createdAt: string;
    content?: unknown;         // ✅ AJOUTÉ (unknown force un typage sûr plus tard, pas de 'any')
}

export const articleService = {
    getAll: async (): Promise<ApiArticle[]> => {
        const response = await api.get<{ success: boolean; data: ApiArticle[] }>('/articles?sort=-createdAt&limit=50');
        return response.data.data;
    },

    getLatest: async (): Promise<ApiArticle[]> => {
        const response = await api.get<{ success: boolean; data: ApiArticle[] }>('/articles/latest');
        return response.data.data;
    },

    getById: async (id: string): Promise<ApiArticle> => {
        const response = await api.get<{ success: boolean; data: ApiArticle }>(`/articles/${id}`);
        return response.data.data;
    },

    getBySlug: async (slug: string): Promise<ApiArticle> => {
        const response = await api.get<{ success: boolean; data: ApiArticle }>(`/articles/${slug}`);
        return response.data.data;
    }
};