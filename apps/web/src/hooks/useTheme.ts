import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // Vérifier le localStorage d'abord
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) return stored;
        
        // Sinon, vérifier la préférence système
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        // Par défaut, mode clair
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // Retirer la classe dark d'abord
        root.classList.toggle('dark', theme === 'dark');
        
        // Sauvegarder dans localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}