import api from './api';
import type { Sector, CreateSectorDTO } from '../types/sector';

export const sectorService = {
    getAll: async (): Promise<Sector[]> => {
        const response = await api.get<{ success: boolean; data: Sector[] }>('/sectors');
        return response.data.data;
    },

    create: async (data: CreateSectorDTO): Promise<Sector> => {
        const response = await api.post<{ success: boolean; data: Sector }>('/sectors', data);
        return response.data.data;
    },

    update: async (id: string, data: Partial<CreateSectorDTO>): Promise<Sector> => {
        const response = await api.put<{ success: boolean; data: Sector }>(`/sectors/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/sectors/${id}`);
    }
};