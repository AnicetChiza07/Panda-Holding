import api from './api';

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    content: string;
    rating: number;
}

export const testimonialService = {
    getActiveTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const response = await api.get('/testimonials/active');
            const rawData = response.data;

            // Extraction robuste des données pour gérer toutes les structures de réponse possibles
            if (Array.isArray(rawData)) {
                return rawData;
            }
            if (rawData?.data && Array.isArray(rawData.data)) {
                return rawData.data;
            }
            if (rawData?.results && Array.isArray(rawData.results)) {
                return rawData.results;
            }

            // Retourne un tableau vide si le format est inattendu
            return [];
        } catch (error) {
            // On garde uniquement le log d'erreur en cas de vrai problème réseau ou serveur
            console.error('Erreur testimonialService:', error);
            return [];
        }
    }
};