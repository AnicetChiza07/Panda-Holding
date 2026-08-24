import api from './api';
import type { Partner, PartnerFormData } from '../types/partner';

export const partnerService = {
    getAll: async (): Promise<Partner[]> => {
        const response = await api.get<{ success: boolean; data: Partner[] }>('/partners');
        return response.data.data;
    },
    create: async (data: PartnerFormData): Promise<Partner> => {
        const response = await api.post<{ success: boolean; data: Partner }>('/partners', data);
        return response.data.data;
    },
    update: async (id: string, data: Partial<PartnerFormData>): Promise<Partner> => {
        const response = await api.put<{ success: boolean; data: Partner }>(`/partners/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/partners/${id}`);
    },
};