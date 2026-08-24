import api from './api';

export interface ApiPartner {
    _id: string;
    name: string;
    logo?: string;
    website?: string;
    isActive?: boolean;
}

export const partnerService = {
    // Récupère tous les partenaires actifs pour le site public
    getAll: async (): Promise<ApiPartner[]> => {
        const response = await api.get<{ success: boolean; data: ApiPartner[] }>('/partners?isActive=true');
        return response.data.data;
    }
};