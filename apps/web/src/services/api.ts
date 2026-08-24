// src/services/api.ts
import axios from 'axios';

// URL de base de l'API (utilise la variable d'environnement si définie, sinon localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Création de l'instance Axios avec configuration par défaut
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout de 10 secondes pour éviter les requêtes qui bloquent
});

// Intercepteur de requête : ajoute automatiquement le token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur de réponse : gère les erreurs globales (ex: token expiré)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token invalide ou expiré → déconnexion automatique
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;