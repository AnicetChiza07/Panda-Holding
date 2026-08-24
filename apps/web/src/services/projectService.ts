import api from './api';

export interface ApiProject {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    location?: string;
    shortDescription?: string;
    longDescription?: string | unknown; // Texte, tableau de blocs ou JSON Tiptap
    coverImage?: string;
    gallery?: string[]; // Correspond à "galerie"
    isActive?: boolean;
}

export const projectService = {
    /**
     * Récupère tous les projets actifs pour la page liste
     */
    getAll: async (): Promise<ApiProject[]> => {
        const response = await api.get<{ success: boolean; data: ApiProject[] }>('/projects?isActive=true&sort=-createdAt&limit=50');
        return response.data.data;
    },

    /**
     * Récupère un projet spécifique par son slug pour la page de détail
     */
    getBySlug: async (slug: string): Promise<ApiProject> => {
        const response = await api.get<{ success: boolean; data: ApiProject }>(`/projects/${slug}`);
        return response.data.data;
    }
};