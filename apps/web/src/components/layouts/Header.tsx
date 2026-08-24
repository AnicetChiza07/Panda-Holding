import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Actualités', path: '/blog' },
    { name: 'Secteurs', path: '/sectors' },
    { name: 'Réalisations', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
];

export function Header() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
                    isScrolled
                    // ✅ CORRECTION 1 : Fond sombre correct en mode sombre
                    ? 'bg-white/70 backdrop-blur-md shadow-md dark:bg-gray-900/50'
                    : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-300 dark:border-white/20">
                    <div className="flex items-center justify-between h-20">
              
                        <Link to="/" className="flex-shrink-0 group animate-fadeInDown delay-100" aria-label="Retour à l'accueil">
                            <Logo className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
                        </Link>

                        <div className="hidden lg:flex items-center gap-2 animate-fadeInDown delay-200">
                            <nav 
                                aria-label="Navigation principale"
                                className="flex items-center gap-1 px-2 py-2 rounded-full border border-gray-300 dark:border-white/20 w-fit flex-shrink-0"
                            >
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`relative px-4 py-2 text-sm tracking-wide transition-all duration-300 rounded-full ${
                                                isActive
                                                ? 'bg-primary/10 dark:bg-secondary/10 text-primary dark:text-white'
                                                : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white'
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <ThemeToggle />
                        </div>

                        <div className="flex items-center gap-3 lg:hidden animate-fadeInDown delay-200">
                            <ThemeToggle />
                            <button
                                type="button"
                                className="p-3 rounded-full border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-expanded={isMobileMenuOpen}
                                aria-label="Ouvrir le menu de navigation"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
            />

            <div
                className={`fixed top-0 right-0 h-full w-[330px] max-w-[85vw] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-[70] lg:hidden transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-white/10 ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{
                    boxShadow: isMobileMenuOpen ? '-8px 0 30px rgba(0, 0, 0, 0.15)' : 'none'
                }}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Logo className="h-8 w-auto" />
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-full border border-gray-300 dark:border-white/15 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Fermer le menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav aria-label="Navigation mobile" className="flex flex-col space-y-3 flex-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`relative flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
                                        isActive
                                            ? 'bg-primary border-primary dark:bg-secondary/15 dark:border-white/15 text-white'
                                            : 'bg-white dark:bg-transparent border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-primary dark:hover:border-white/30 hover:text-primary dark:hover:text-white'
                                    }`}
                                >
                                    <span className="text-sm font-medium">{link.name}</span>
                                    {isActive && (
                                        <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 ml-2"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}