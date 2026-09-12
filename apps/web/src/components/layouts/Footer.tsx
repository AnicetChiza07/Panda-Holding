import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo/panda-logo.png';

const navigationLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Actualités', path: '/blog' },
    { name: 'Secteurs', path: '/sectors' },
    { name: 'Réalisations', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
];

export function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > window.innerHeight);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="bg-primary dark:bg-gray-900 text-gray-300 relative overflow-hidden">
                {/* Lueurs subtiles en arrière-plan pour la profondeur */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* Zone principale - 3 colonnes (Identité, Navigation, Contact) */}
                    <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        
                        {/* Colonne 1 : Identité & Réseaux sociaux */}
                        <div className="space-y-6 animate-fadeInUp">
                            {/* Logo avec le bon chemin */}
                            <img src={logo} alt="Panda Holding Logo" className="h-10 w-auto brightness-0 invert dark:brightness-100 dark:invert-0" />
                            
                            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                                Panda Holding Capital est une entreprise congolaise dédiée au développement de projets innovants et durables à travers la RDC.
                            </p>

                            {/* Réseaux sociaux avec SVG et centrage parfait */}
                            <div className="flex items-center gap-3 pt-2">
                                {/* Facebook */}
                                <a 
                                    href="https://www.facebook.com/share/1DZiH5ajcr/?mibextid=wwXIfr" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Facebook" 
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-105"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>

                                {/* Instagram */}
                                <a 
                                    href="https://www.instagram.com/panda_holding_capital?igsi=NnEzd3gzazU4bmlh" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Instagram" 
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-105"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                </a>

                                {/* TikTok */}
                                <a 
                                    href="https://www.tiktok.com/@panda_holding_capital?_r=1&_t=ZS-999UjfA9VsA" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="TikTok" 
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300 hover:scale-105"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.65a8.16 8.16 0 004.77 1.52V6.73a4.85 4.85 0 01-1.84-.04z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Colonne 2 : Navigation avec effet de ligne au survol */}
                        <div className="animate-fadeInUp delay-100">
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-8 flex items-center gap-3">
                                Navigation
                                <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
                            </h3>
                            
                            <ul className="space-y-4">
                                {navigationLinks.map((link) => (
                                    <li key={link.name}>
                                        <a 
                                            href={link.path}
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 group"
                                        >
                                            <span className="w-0 h-px bg-accent group-hover:w-4 transition-all duration-300"></span>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Colonne 3 : Contact avec icônes stylisées */}
                        <div className="animate-fadeInUp delay-200">
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-8 flex items-center gap-3">
                                Contact
                                <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
                            </h3>
                            
                            <ul className="space-y-5">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
                                        <MapPin className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="text-sm text-gray-400 pt-1.5">Kinshasa, République Démocratique du Congo</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
                                        <Mail className="w-4 h-4 text-accent" />
                                    </div>
                                    <a href="mailto:contact@pandaholding.cd" className="text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                                        contact@pandaholding.cd
                                    </a>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
                                        <Phone className="w-4 h-4 text-accent" />
                                    </div>
                                    <a href="tel:+243000000000" className="text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                                        +243 000 000 000
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Barre de séparation */}
                    <div className="border-t border-white/10"></div>

                    {/* Barre du bas : Copyright + Retour en haut */}
                    <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400 text-center md:text-left">
                            © {currentYear} Panda Holding Capital. Tous droits réservés.
                        </p>

                        <button
                            onClick={scrollToTop}
                            className={`w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent/20 ${
                                showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                            aria-label="Retour en haut"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </footer>
        </>
    );
}