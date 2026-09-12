import api from './api';

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    content: string;
    rating: number;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTestimonialData {
    name: string;
    role: string;
    company: string;
    image: string;
    content: string;
    rating: number;
    isActive?: boolean;
    order?: number;
}

export const testimonialService = {
    getAll: async () => {
        const response = await api.get('/testimonials');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/testimonials/${id}`);
        return response.data;
    },

    create: async (data: CreateTestimonialData) => {
        const response = await api.post('/testimonials', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateTestimonialData>) => {
        const response = await api.put(`/testimonials/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/testimonials/${id}`);
        return response.data;
    },

    toggleActive: async (id: string, isActive: boolean) => {
        const response = await api.put(`/testimonials/${id}`, { isActive });
        return response.data;
    }
};