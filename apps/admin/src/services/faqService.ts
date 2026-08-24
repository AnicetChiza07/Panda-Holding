import api from './api';
import type { Faq, FaqFormData } from '../types/faq';

export const faqService = {
    getAll: async (): Promise<Faq[]> => {
        const response = await api.get<{ success: boolean; data: Faq[] }>('/faqs');
        return response.data.data;
    },
    create: async (data: FaqFormData): Promise<Faq> => {
        const response = await api.post<{ success: boolean; data: Faq }>('/faqs', data);
        return response.data.data;
    },
    update: async (id: string, data: Partial<FaqFormData>): Promise<Faq> => {
        const response = await api.put<{ success: boolean; data: Faq }>(`/faqs/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/faqs/${id}`);
    },
};