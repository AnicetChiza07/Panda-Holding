import api from './api';
import type { Project, ProjectFormData } from '../types/project';

export const projectService = {
    getAll: async (): Promise<Project[]> => {
        const response = await api.get<{ success: boolean; data: Project[] }>('/projects');
        return response.data.data;
    },
    create: async (data: ProjectFormData): Promise<Project> => {
        const response = await api.post<{ success: boolean; data: Project }>('/projects', data);
        return response.data.data;
    },
    // ✅ Remplacement de 'any' par 'Partial<ProjectFormData>'
    update: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
        const response = await api.put<{ success: boolean; data: Project }>(`/projects/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
};