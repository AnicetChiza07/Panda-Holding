import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Briefcase } from 'lucide-react'; // ✅ Loader2 supprimé
import { PageHero } from '../components/common/PageHero';
import { SafeImage } from '../components/common/SafeImage';
import { CardSkeleton } from '../components/common/Skeletons'; // ✅ AJOUT DU SKELETON
import { projectService, type ApiProject } from '../services/projectService';

// ==========================================
// TYPES & MAPPING
// ==========================================
interface DisplayProject {
    id: string;
    slug: string;
    categorie: string;
    lieu: string;
    titre: string;
    description: string;
    image: string;
}

const formatProject = (apiProject: ApiProject): DisplayProject => ({
    id: apiProject._id,
    slug: apiProject.slug,
    categorie: apiProject.category || 'Général',
    lieu: apiProject.location || 'RDC',
    titre: apiProject.title,
    description: apiProject.shortDescription || 'Projet d\'impact majeur en cours de réalisation.',
    image: apiProject.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
});

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function PortfolioPage() {
    const [projects, setProjects] = useState<DisplayProject[]>([]);
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiData = await projectService.getAll();
                const formattedData = apiData.map(formatProject);
                setProjects(formattedData);
            } catch (err) {
                console.error("Erreur chargement projets:", err);
                setError("Impossible de charger les réalisations pour le moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Filtrage dynamique
    const filteredProjets = activeCategory === "Tous" 
        ? projects 
        : projects.filter(projet => projet.categorie === activeCategory);

    // Extraction dynamique des catégories depuis les vraies données
    const dynamicCategories = ["Tous", ...Array.from(new Set(projects.map(p => p.categorie)))];

    // ✅ ÉTAT DE CHARGEMENT AVEC SKELETONS (Remplace le simple spinner)
    if (loading) {
        return (
            <>
                <PageHero 
                    title="Nos Réalisations" 
                    highlight="& Projets d'Impact" 
                    description="Chargement des données..." 
                    breadcrumbs={[{ label: "Accueil", path: "/" }, { label: "Réalisations" }]} 
                />
                <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-gray-900/40 relative overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Filtres Skeleton */}
                        <div className="flex flex-wrap gap-3 mb-12 animate-fadeInUp">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-24 h-10 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full" />
                            ))}
                        </div>
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

    // État d'erreur ou vide
    if (error || projects.length === 0) {
        return (
            <>
                <PageHero title="Nos Réalisations" highlight="& Projets d'Impact" description="De la vision à la réalité." breadcrumbs={[{ label: "Accueil", path: "/" }, { label: "Réalisations" }]} />
                <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-gray-900/40 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 mb-4">
                            <Briefcase className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {error || "Aucune réalisation n'est disponible pour le moment."}
                        </h3>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <PageHero
                title="Nos Réalisations"
                highlight="& Projets d'Impact"
                description="De la vision à la réalité : découvrez comment nous transformons concrètement le paysage économique et social en RDC."
                breadcrumbs={[
                    { label: "Accueil", path: "/" },
                    { label: "Réalisations" }
                ]}
            />

            {/* Section principale */}
            <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-gray-900/40 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* FILTRES DYNAMIQUES */}
                    <div className="flex flex-wrap gap-3 mb-12 animate-fadeInUp">
                        {dynamicCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeCategory === category
                                        ? 'bg-accent text-primary'
                                        : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/20 hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Grille des projets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredProjets.map((projet, index) => (
                            <Link 
                                key={projet.id}
                                to={`/portfolio/${projet.slug}`}
                                className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/40 animate-fadeInUp"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* IMAGE SÉCURISÉE */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <SafeImage 
                                        src={projet.image} 
                                        alt={projet.titre}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                
                                {/* Contenu */}
                                <div className="flex flex-col flex-1 p-6">
                                    {/* Lieu + Catégorie sur la même ligne */}
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{projet.lieu}</span>
                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                        <span className="font-medium text-primary dark:text-accent">{projet.categorie}</span>
                                    </div>

                                    {/* Titre */}
                                    <h3 className="text-lg font-bold text-primary dark:text-white mb-3 leading-tight group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors duration-300">
                                        {projet.titre}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1 line-clamp-3">
                                        {projet.description}
                                    </p>
                                    
                                    {/* LIEN "VOIR LE PROJET" */}
                                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/5 dark:bg-white/5 rounded-full text-sm font-semibold text-primary dark:text-white group-hover:bg-accent group-hover:text-primary transition-all duration-300 w-fit">
                                        Voir le projet
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Message si aucun projet dans cette catégorie */}
                    {filteredProjets.length === 0 && (
                        <div className="text-center py-16 animate-fadeInUp">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Aucune réalisation n'est encore disponible dans la catégorie "{activeCategory}".
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}