import api from './api';

// ==========================================
// TYPES
// ==========================================
export interface ApiCarouselSlide {
    _id: string;
    title: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    order?: number;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// SERVICE
// ==========================================
export const carouselService = {
    /**
     * Récupère tous les slides (pour le frontend public)
     * Filtre uniquement les slides actifs et les trie par ordre
     */
    getAll: async (): Promise<ApiCarouselSlide[]> => {
        const response = await api.get<{ success: boolean; data: ApiCarouselSlide[] }>('/carousel?isActive=true&sort=order');
        return response.data.data;
    },

    /**
     * Récupère tous les slides (pour le panneau d'administration, y compris les inactifs)
     */
    getAllAdmin: async (): Promise<ApiCarouselSlide[]> => {
        const response = await api.get<{ success: boolean; data: ApiCarouselSlide[] }>('/carousel?sort=order');
        return response.data.data;
    },

    /**
     * Récupère un slide spécifique par son ID
     */
    getById: async (id: string): Promise<ApiCarouselSlide> => {
        const response = await api.get<{ success: boolean; data: ApiCarouselSlide }>(`/carousel/${id}`);
        return response.data.data;
    },

    /**
     * Crée un nouveau slide (Admin)
     */
    create: async (slideData: Partial<ApiCarouselSlide>): Promise<ApiCarouselSlide> => {
        const response = await api.post<{ success: boolean; data: ApiCarouselSlide }>('/carousel', slideData);
        return response.data.data;
    },

    /**
     * Met à jour un slide existant (Admin)
     */
    update: async (id: string, slideData: Partial<ApiCarouselSlide>): Promise<ApiCarouselSlide> => {
        const response = await api.put<{ success: boolean; data: ApiCarouselSlide }>(`/carousel/${id}`, slideData);
        return response.data.data;
    },

    /**
     * Supprime un slide (Admin)
     */
    delete: async (id: string): Promise<void> => {
        await api.delete<{ success: boolean }>(`/carousel/${id}`);
    }
};