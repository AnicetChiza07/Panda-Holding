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
            
            // LOG DE DIAGNOSTIC (À supprimer une fois que ça marche sur Vercel)
            console.log("📦 RÉPONSE BRUTE API TÉMOIGNAGES:", response.data);

            const rawData = response.data;

            // Extraction bulletproof : gère TOUTES les structures possibles
            if (Array.isArray(rawData)) {
                return rawData;
            }
            if (rawData?.data && Array.isArray(rawData.data)) {
                return rawData.data;
            }
            if (rawData?.results && Array.isArray(rawData.results)) {
                return rawData.results;
            }

            console.warn("Format de données inattendu pour les témoignages:", rawData);
            return [];
            
        } catch (error) {
            console.error('Erreur critique testimonialService:', error);
            return [];
        }
    }
};