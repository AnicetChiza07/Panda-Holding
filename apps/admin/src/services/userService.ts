// src/services/userService.ts
import api from './api';
import type { User, ProfileFormData } from '../types/user';

export const userService = {
    getMe: async (): Promise<User> => {
        const response = await api.get<{ success: boolean; data: User }>('/users/me');
        return response.data.data;
    },
    updateProfile: async (data: ProfileFormData): Promise<User> => {
        const response = await api.put<{ success: boolean; data: User }>('/users/me', data);
        return response.data.data;
    },
    changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
        await api.put<{ success: boolean }>('/users/change-password', data);
    },
};