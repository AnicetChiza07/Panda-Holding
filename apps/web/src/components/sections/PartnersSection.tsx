import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { partnerService, type ApiPartner } from '../../services/partnerService';
import { Pulse } from '../../components/common/Skeletons';

// ==========================================
// TYPES & MAPPING
// ==========================================
interface DisplayPartner {
    id: string;
    name: string;
    logo: string;
    website?: string;
}

const formatPartner = (apiPartner: ApiPartner): DisplayPartner => ({
    id: apiPartner._id,
    name: apiPartner.name,
    logo: apiPartner.logo || 'https://via.placeholder.com/150x60?text=Logo',
    website: apiPartner.website
});

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function PartnersSection() {
    const [partners, setPartners] = useState<DisplayPartner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setLoading(true);
                const apiData = await partnerService.getAll();
                setPartners(apiData.map(formatPartner));
            } catch (error) {
                console.error("Erreur chargement partenaires:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    // ✅ ÉTAT DE CHARGEMENT AVEC SKELETON (Refactorisé avec Pulse)
    if (loading) {
        return (
            <section className="py-20 lg:py-24 bg-white dark:bg-primary border-y border-gray-100 dark:border-white/5 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête Skeleton */}
                    <div className="max-w-2xl space-y-4 mb-12 animate-fadeInUp">
                        <Pulse className="w-32 h-8 rounded-full" />
                        <Pulse className="w-3/4 h-10 rounded-lg" />
                        <Pulse className="w-full h-4 rounded" />
                    </div>
                    
                    {/* Logos Skeleton */}
                    <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-24 py-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Pulse key={i} className="w-32 h-12 rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // État vide (si aucun partenaire en base de données)
    if (partners.length === 0) {
        return (
            <section className="py-20 lg:py-24 bg-white dark:bg-primary border-y border-gray-100 dark:border-white/5 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aucun partenaire pour le moment</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Notre réseau de partenaires s'agrandit chaque jour.</p>
                </div>
            </section>
        );
    }

    // Rendu principal
    return (
        <section className="py-20 lg:py-24 bg-white dark:bg-primary border-y border-gray-100 dark:border-white/5 relative overflow-hidden">
            
            {/* ==========================================
                EN-TÊTE DE SECTION
                ========================================== */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="max-w-2xl space-y-4 animate-fadeInUp">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                            PARTENAIRES
                        </span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-white leading-tight">
                        Ils nous font <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">confiance</span>
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Un réseau solide d'institutions, d'entreprises et d'organisations qui partagent notre vision pour le développement de la RDC.
                    </p>
                </div>
            </div>

            {/* ==========================================
                MARQUEE (DÉFILEMENT INFINI)
                ========================================== */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 35s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                {/* Effet de fondu sur les bords */}
                <div className="absolute top-0 left-0 w-20 lg:w-48 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none dark:from-primary dark:via-primary/80"></div>
                <div className="absolute top-0 right-0 w-20 lg:w-48 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none dark:from-primary dark:via-primary/80"></div>

                {/* Conteneur du défilement */}
                <div className="overflow-hidden">
                    <div className="flex gap-16 lg:gap-24 animate-scroll w-max items-center py-4">
                        {/* On duplique le tableau pour assurer la boucle infinie parfaite */}
                        {[...partners, ...partners].map((partner, index) => (
                            <div 
                                key={`${partner.id}-${index}`}
                                className="flex-shrink-0 flex items-center justify-center group cursor-default"
                            >
                                <img 
                                    src={partner.logo} 
                                    alt={`Logo ${partner.name}`}
                                    title={partner.name}
                                    className="h-12 lg:h-12 w-auto object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-in-out"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}