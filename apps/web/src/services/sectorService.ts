import api from './api';

export interface ApiSector {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    longDescription?: string | unknown;
    coverImage?: string;
    image?: string;
    images?: string[];      
    category?: string;
    expertises?: string[];     
    subSectors?: string[];
    realizations?: string[];
    isActive?: boolean;
    projectsCount?: number;
    investmentAmount?: string;
}

export const sectorService = {
    getAll: async (): Promise<ApiSector[]> => {
        const response = await api.get<{ success: boolean; data: ApiSector[] }>('/sectors?isActive=true');
        return response.data.data;
    },

    getBySlug: async (slug: string): Promise<ApiSector> => {
        const response = await api.get<{ success: boolean; data: ApiSector }>(`/sectors/${slug}`);
        return response.data.data;
    }
};