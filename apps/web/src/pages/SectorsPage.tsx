import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, Briefcase, Globe, TrendingUp } from 'lucide-react';
import { PageHero } from '../components/common/PageHero'; 
import { CardSkeleton } from '../components/common/Skeletons'; // ✅ AJOUT DU SKELETON
import { sectorService, type ApiSector } from '../services/sectorService';

// ==========================================
// TYPES & MAPPING
// ==========================================
interface DisplaySector {
    id: string;
    slug: string;
    nom: string;
    description: string;
}

const formatSector = (apiSector: ApiSector, index: number): DisplaySector => ({
    id: String(index + 1),
    slug: apiSector.slug,
    nom: apiSector.name,
    description: apiSector.shortDescription || 'Découvrez nos initiatives dans ce secteur stratégique.'
});

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function SectorsPage() {
    const [sectors, setSectors] = useState<DisplaySector[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiData = await sectorService.getAll();
                const formattedData = apiData.map((sector, index) => formatSector(sector, index));
                setSectors(formattedData);
            } catch (err) {
                console.error("Erreur chargement secteurs:", err);
                setError("Impossible de charger la liste des secteurs pour le moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchSectors();
    }, []);

    // ✅ ÉTAT DE CHARGEMENT AVEC SKELETONS (Remplace le simple spinner)
    if (loading) {
        return (
            <>
                <PageHero 
                    title="Nos Secteurs" 
                    highlight="d'Intervention" 
                    description="Chargement des données..." 
                    breadcrumbs={[{ label: "Accueil", path: "/" }, { label: "Secteurs" }]} 
                />
                <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-gray-900/40 relative overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Grille de Cartes Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <CardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error || sectors.length === 0) {
        return (
            <>
                <PageHero 
                    title="Nos Secteurs" 
                    highlight="d'Intervention" 
                    description="Panda Holding Capital déploie son expertise dans des secteurs stratégiques." 
                    breadcrumbs={[{ label: "Accueil", path: "/" }, { label: "Secteurs" }]} 
                />
                <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-gray-900/40 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 mb-4">
                            <Briefcase className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {error || "Aucun secteur d'activité n'est disponible pour le moment."}
                        </h3>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <PageHero
                title="Nos Secteurs"
                highlight="d'Intervention"
                description="Panda Holding Capital déploie son expertise et ses ressources dans des secteurs stratégiques pour bâtir une économie résiliente et prospère."
                breadcrumbs={[{ label: "Accueil", path: "/" }, { label: "Secteurs" }]}
            />

            <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-gray-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {sectors.map((secteur, index) => (
                            <Link 
                                key={secteur.id}
                                to={`/sectors/${secteur.slug}`}
                                className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-gray-200/60 dark:border-white/10 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/40 animate-fadeInUp"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* HAUT : Chiffre à gauche, Icône à droite */}
                                <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200/60 dark:border-white/10">
                                    <h4 className="text-2xl font-bold text-primary dark:text-white leading-none">
                                        {secteur.id}
                                    </h4>
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20 dark:group-hover:bg-accent/20">
                                        <Target className="w-5 h-5 text-primary dark:text-accent" strokeWidth={2} />
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-primary dark:text-white mb-3 leading-tight group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors duration-300">
                                    {secteur.nom}
                                </h3>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-1">
                                    {secteur.description}
                                </p>
                                
                                {/* BLOC STATIQUE ÉLÉGANT */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200/60 dark:border-white/10 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center flex-shrink-0">
                                            <Globe className="w-4 h-4 text-primary dark:text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Portée</p>
                                            <p className="text-xs font-medium text-primary/90 dark:text-white/80">RDC & Afrique</p>
                                        </div>
                                    </div>
                                    
                                    <div className="w-px h-10 bg-gray-200 dark:bg-white/10"></div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-accent/20 flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-4 h-4 text-primary dark:text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Vision</p>
                                            <p className="text-xs font-medium text-primary/90 dark:text-white/80">Long Terme</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-white group-hover:text-accent transition-colors duration-300">
                                    Voir les détails
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}