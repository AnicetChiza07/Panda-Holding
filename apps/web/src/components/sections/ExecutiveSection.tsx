import { Quote } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';
import DirectorImage from '../../assets/images/Arthur.jpeg'; // ✅ Import de l'image du directeur

export function ExecutiveSection() {
    return (
        <section className="py-20 lg:py-28 bg-white dark:bg-primary relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Layout principal : Grille de 12 colonnes pour un contrôle premium de l'espace */}
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">
                        
                        {/* ==========================================
                            IMAGE - Colonne 2 à 6 (Laisse une marge à gauche, poussée vers le centre)
                            ========================================== */}
                        <div className="lg:col-span-5 lg:col-start-2 flex justify-center lg:justify-end animate-fadeInUp">
                            {/* MODIFICATION ICI : aspect-[3/4] sur mobile/tablette, lg:aspect-[4/5] sur grand écran */}
                            <div className="relative aspect-[3/4] lg:aspect-[4/5] max-w-sm sm:max-w-md w-full">
                                <div className="absolute inset-0 bg-secondary/5 dark:bg-secondary/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transform rotate-3 transition-transform duration-500 hover:rotate-0"></div>
                                
                                <div className="absolute inset-3 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden">
                                    <SafeImage
                                        src={ DirectorImage }
                                        alt="Arthur MESHE - Directeur Général"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                
                                <div className="absolute -top-6 -right-6 w-20 h-20 border border-secondary/30 dark:border-secondary/20 rounded-full"></div>
                                <div className="absolute -bottom-6 -left-6 w-16 h-16 border border-accent/30 dark:border-accent/20 rounded-full"></div>
                            </div>
                        </div>

                        {/* ==========================================
                            CONTENU - Colonne 8 à 12 (Commence après un espace vide, créant une séparation élégante)
                            ========================================== */}
                        <div className="lg:col-span-5 lg:col-start-8 animate-fadeInUp delay-200">
                            
                            {/* Position en haut */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-px bg-secondary"></div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Directeur Général
                                </span>
                            </div>

                            {/* Nom avec gradient sur MESHE */}
                            <h2 className="text-4xl sm:text-5xl font-bold text-primary dark:text-white leading-[1.1] tracking-tight mb-8">
                                Arthur <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">MESHE</span>
                            </h2>

                            {/* Citation avec style editorial */}
                            <div className="relative mb-8">
                                <div className="flex gap-5">
                                    <div className="flex flex-col items-center flex-shrink-0">
                                        <Quote className="w-5 h-5 text-secondary" />
                                        <div className="w-px flex-1 bg-secondary/30 mt-2"></div>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-md text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                                            La solution est toujours proche, même lorsque le chemin semble difficile. Avec persévérance et détermination, chaque défi peut trouver sa réponse.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Signature compacte avec nom en gradient */}
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
                                <div className="w-10 h-10 rounded-full border-2 border-secondary flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary dark:text-secondary">
                                        PH
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-px bg-gray-300 dark:bg-white/20"></div>
                                    <span className="text-sm font-medium text-primary dark:text-white">
                                        <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Panda Holding</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}