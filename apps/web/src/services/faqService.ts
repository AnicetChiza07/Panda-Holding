import api from './api';

// ==========================================
// INTERFACE POUR LA STRUCTURE TIPTAP
// ==========================================
export interface TiptapNode {
    type: string;
    text?: string;
    content?: TiptapNode[];
}

// ==========================================
// INTERFACE PRINCIPALE DE LA FAQ
// ==========================================
export interface ApiFaq {
    _id: string;
    question: string;
    answer: string | TiptapNode; 
    order?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ==========================================
// SERVICE
// ==========================================
export const faqService = {
    getAll: async (): Promise<ApiFaq[]> => {
        const response = await api.get<{ success: boolean; data: ApiFaq[] }>('/faqs?isActive=true&sort=order');
        return response.data.data;
    },

    getAllAdmin: async (): Promise<ApiFaq[]> => {
        const response = await api.get<{ success: boolean; data: ApiFaq[] }>('/faqs?sort=order');
        return response.data.data;
    },

    create: async (faqData: Partial<ApiFaq>): Promise<ApiFaq> => {
        const response = await api.post<{ success: boolean; data: ApiFaq }>('/faqs', faqData);
        return response.data.data;
    },

    update: async (id: string, faqData: Partial<ApiFaq>): Promise<ApiFaq> => {
        const response = await api.put<{ success: boolean; data: ApiFaq }>(`/faqs/${id}`, faqData);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete<{ success: boolean }>(`/faqs/${id}`);
    }
};