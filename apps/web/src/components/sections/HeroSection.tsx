import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Building2, Star } from 'lucide-react';
import heroImage from '../../assets/images/Business-team.jpg';
import { SafeImage } from '../common/SafeImage';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-12 lg:pt-0 lg:pb-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                    
                    {/* COLONNE 1 : CONTENU TEXTUEL */}
                    <div className="space-y-6 text-center lg:text-left order-1">
                        
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-secondary/10 border border-gray-300 dark:border-white/15 rounded-full animate-fadeInUp delay-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                            </span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                Investissements Durables & Innovants
                            </span>
                        </div>
                        
                        {/* Titre Principal */}
                        <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold leading-tight animate-fadeInUp delay-200">
                            <span className="text-primary dark:text-white">Bâtir l'avenir avec</span> <br className="hidden sm:block" />
                            <span className="inline-block mt-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                Solidité
                            </span>
                        </h1>
                        
                        {/* Avatars et Stats */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 lg:justify-start justify-center animate-fadeInUp delay-300">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-medium border-2 border-white dark:border-white">
                                    IM
                                </div>
                                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-medium border-2 border-white dark:border-white">
                                    EV
                                </div>
                                <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-[10px] font-medium border-2 border-white dark:border-accent">
                                    TO
                                </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                <strong className="text-primary dark:text-white text-sm">5+ Secteurs</strong> d'excellence
                            </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-base max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fadeInUp delay-400">
                            Panda Holding accompagne la croissance économique en RDC à travers des investissements stratégiques dans l'immobilier, le tourisme et l'innovation.
                        </p>
                        
                        {/* ✅ LIENS DE NAVIGATION (PAS DES BOUTONS) */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 lg:justify-start justify-center animate-fadeInUp delay-500">
                            {/* Lien Principal */}
                            <Link 
                                to="/sectors"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-primary rounded-full font-semibold text-sm hover:bg-accent/90 hover:scale-[1.02] transition-all duration-300"
                            >
                                Découvrir nos secteurs
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            
                            {/* Lien Secondaire */}
                            <Link 
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-white/20 rounded-full font-semibold text-sm text-gray-700 dark:text-white hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white transition-all duration-300"
                            >
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                    
                    {/* COLONNE 2 : IMAGE ET BADGES */}
                    <div className="relative flex items-center justify-center h-[400px] sm:h-[500px] lg:h-[550px] order-2 mt-2 lg:mt-0 animate-fadeInScale delay-300">
                        
                        {/* Cercle en pointillés qui tourne */}
                        <div className="absolute w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] border-2 border-dashed border-secondary/30 dark:border-secondary/20 rounded-full animate-[spin_25s_linear_infinite]"></div>
                        
                        {/* Couche qui entoure l'image */}
                        <div className="absolute w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] bg-secondary/15 dark:bg-secondary/20 rounded-full"></div>
                        
                        {/* Image principale */}
                        <div className="relative w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] lg:w-[340px] lg:h-[340px] rounded-full overflow-hidden shadow-2xl z-10">
                            <SafeImage 
                                src={heroImage} 
                                alt="Développement économique en RDC - Panda Holding"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Badges Flottants (inchangés) */}
                        <div className="hidden lg:block absolute top-20 right-16 bg-white dark:bg-primary/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-gray-200 dark:border-white/20 animate-fadeInUp delay-600" style={{ animation: 'fadeInUp 0.8s ease-out 0.6s forwards, float 4s ease-in-out 1.4s infinite', opacity: 0 }}>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-primary dark:text-accent" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Croissance</p>
                                    <p className="text-sm font-semibold text-primary dark:text-white">+150%</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden lg:block absolute bottom-36 left-0 bg-white dark:bg-primary/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-gray-200 dark:border-white/20 animate-fadeInUp delay-700" style={{ animation: 'fadeInUp 0.8s ease-out 0.7s forwards, float 4s ease-in-out 1.5s infinite', opacity: 0 }}>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 bg-secondary/20 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-primary dark:text-secondary" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Partenaires</p>
                                    <p className="text-sm font-semibold text-primary dark:text-white">50+</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden lg:block absolute bottom-0 right-24 bg-white dark:bg-primary/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-gray-200 dark:border-white/20 animate-fadeInUp delay-800" style={{ animation: 'fadeInUp 0.8s ease-out 0.8s forwards, float 4s ease-in-out 1.6s infinite', opacity: 0 }}>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 bg-primary/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                                    <Star className="w-4 h-4 text-primary dark:text-accent fill-accent" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Satisfaction</p>
                                    <p className="text-sm font-semibold text-primary dark:text-white">98%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}