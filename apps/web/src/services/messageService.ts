import api from './api';

export interface ApiMessage {
    _id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const messageService = {
    /**
     * Envoie un nouveau message depuis le formulaire de contact public
     * ✅ CORRECTION : Utilisation de la route '/contact' qui correspond à submitContactForm
     */
    sendMessage: async (data: { name: string; email: string; subject: string; message: string }): Promise<ApiMessage> => {
        const response = await api.post<{ success: boolean; data: ApiMessage }>('/contact', data);
        return response.data.data;
    },

    /**
     * Récupère tous les messages (pour le panneau d'administration)
     */
    getAll: async (): Promise<ApiMessage[]> => {
        const response = await api.get<{ success: boolean; data: ApiMessage[] }>('/messages?sort=-createdAt&limit=100');
        return response.data.data;
    },

    /**
     * Marque un message comme lu (Admin)
     */
    markAsRead: async (id: string): Promise<void> => {
        await api.put(`/messages/${id}/read`);
    },

    /**
     * Supprime un message (Admin)
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/messages/${id}`);
    }
};