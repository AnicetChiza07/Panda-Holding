import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            // Correction : bg-primary/5 en mode clair pour que le hover (bg-primary/10) soit bien visible
            className="relative w-13 h-13 rounded-full border border-gray-300 dark:border-white/15 bg-primary/5 dark:bg-secondary/15 hover:bg-primary/10 dark:hover:bg-secondary/20 transition-all duration-300 group overflow-hidden"
            aria-label="Changer le thème"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Icône Soleil (visible en mode sombre) */}
                <Sun 
                    className={`w-5 h-5 text-accent transition-all duration-500 ${
                        theme === 'dark' 
                        ? 'opacity-100 rotate-0 scale-100' 
                        : 'opacity-0 -rotate-90 scale-50'
                    }`} 
                />
                
                {/* Icône Lune (visible en mode clair) */}
                <Moon 
                    className={`absolute w-5 h-5 text-primary dark:text-secondary transition-all duration-500 ${
                        theme === 'light' 
                        ? 'opacity-100 rotate-0 scale-100' 
                        : 'opacity-0 rotate-90 scale-50'
                    }`} 
                />
            </div>
            
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
    );
}