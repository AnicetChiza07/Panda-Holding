import api from './api';
import type { CarouselSlide, CarouselSlideFormData } from '../types/carousel';

const ENDPOINT = '/carousel';

export const carouselService = {
    getAll: async (): Promise<CarouselSlide[]> => {
        const response = await api.get<{ success: boolean; data: CarouselSlide[] }>(ENDPOINT);
        return response.data.data;
    },
    create: async (data: CarouselSlideFormData): Promise<CarouselSlide> => {
        const response = await api.post<{ success: boolean; data: CarouselSlide }>(ENDPOINT, data);
        return response.data.data;
    },
    update: async (id: string, data: Partial<CarouselSlideFormData>): Promise<CarouselSlide> => {
        const response = await api.put<{ success: boolean; data: CarouselSlide }>(`${ENDPOINT}/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`${ENDPOINT}/${id}`);
    },
};