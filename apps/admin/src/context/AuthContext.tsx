import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string; // ✅ Ajouté pour supporter l'avatar
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    updateUser: (updatedUser: User) => void; // ✅ Nouvelle fonction pour mettre à jour le profil
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(() => {
        return authService.getCurrentUser();
    });
    
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    // ✅ Fonction pour mettre à jour les infos utilisateur sans retaper le mot de passe
    const updateUser = (updatedUser: User) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, updateUser, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}