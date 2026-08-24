import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
    return (
        <>
            {/* Animation personnalisée pour le flottement */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>

            {/* ✅ FOND ADAPTÉ : Blanc en light mode, Bleu nuit (primary) en dark mode */}
            <div className="relative w-screen h-screen overflow-hidden bg-white/10 dark:bg-primary/10 transition-colors duration-300">
                
                {/* Lueurs décoratives en arrière-plan */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                {/* Grille subtile en arrière-plan (Couleurs adaptées pour light/dark) */}
                <div 
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                ></div>

                {/* Contenu centré */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                    
                    {/* Grand 404 avec animation de flottement */}
                    <div className="animate-float">
                        <h1 className="text-[8rem] sm:text-[12rem] lg:text-[16rem] font-black leading-none tracking-tighter bg-gradient-to-b from-accent via-accent/80 to-accent/20 bg-clip-text text-transparent select-none">
                            404
                        </h1>
                    </div>

                    {/* Texte explicatif (Couleurs adaptées pour light/dark) */}
                    <div className="text-center space-y-4 mt-4 sm:mt-8 max-w-xl">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white leading-tight">
                            Page non trouvée
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-white/60 leading-relaxed px-4">
                            La page que vous cherchez n'existe pas ou a été déplacée. 
                            Pas de panique, nous allons vous ramener à l'accueil.
                        </p>
                    </div>

                    {/* Bouton retour */}
                    <div className="mt-8 sm:mt-12">
                        <Link 
                            to="/"
                            className="inline-flex items-center gap-3 px-8 py-3.5 bg-accent text-primary font-md rounded-full hover:bg-accent/90 hover:scale-105 transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            Retour à l'accueil
                        </Link>
                    </div>

                </div>

                {/* Signatures (Couleurs adaptées pour light/dark) */}
                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-gray-400 dark:text-white/20 text-xs sm:text-sm font-mono tracking-wider">
                    04 / 04
                </div>

                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-gray-400 dark:text-white/20 text-xs sm:text-sm font-semibold tracking-wider uppercase">
                    Panda Holding
                </div>
            </div>
        </>
    );
}