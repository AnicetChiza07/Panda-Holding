import api from './api';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};