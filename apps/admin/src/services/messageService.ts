import api from './api';
import type { ContactMessage } from '../types/message';

const ENDPOINT = '/contact/messages';

export const messageService = {
    getAll: async (): Promise<ContactMessage[]> => {
        const response = await api.get<{ success: boolean; data: ContactMessage[] }>(ENDPOINT);
        return response.data.data;
    },
    markAsRead: async (id: string): Promise<ContactMessage> => {
        const response = await api.put<{ success: boolean; data: ContactMessage }>(`${ENDPOINT}/${id}/read`);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};