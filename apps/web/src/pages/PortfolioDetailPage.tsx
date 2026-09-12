import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowRight, Phone, AlertCircle } from 'lucide-react';
import { SafeImage } from '../components/common/SafeImage';
import { projectService, type ApiProject } from '../services/projectService';
import { HeroSkeleton, TextSkeleton } from '../components/common/Skeletons';
import { SEO } from '../components/common/SEO';

// ==========================================
// TYPES STRICTS POUR LE CONTENU
// ==========================================
type ContentBlock = 
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string };

interface DisplayProjectDetail {
    slug: string;
    categorie: string;
    lieu: string;
    titre: string;
    imageHero: string;
    descriptionLongue: ContentBlock[];
    galerie: string[];
}

// ==========================================
// FONCTION DE MAPPING SÉCURISÉE
// ==========================================
const formatProjectDetail = (apiProject: ApiProject): DisplayProjectDetail => {
    // 1. Parsing robuste de la description longue
    let descriptionLongue: ContentBlock[] = [];
    
    if (typeof apiProject.longDescription === 'string') {
        descriptionLongue = [{ type: 'paragraph', text: apiProject.longDescription }];
    } else if (Array.isArray(apiProject.longDescription)) {
        descriptionLongue = apiProject.longDescription.map((block: unknown) => {
            const b = block as Record<string, unknown>;
            if (b.type === 'paragraph' && typeof b.text === 'string') return { type: 'paragraph' as const, text: b.text };
            if (b.type === 'heading' && typeof b.text === 'string') return { type: 'heading' as const, text: b.text };
            return { type: 'paragraph' as const, text: String(b.text || '') };
        }) as ContentBlock[];
    } else if (apiProject.longDescription && typeof apiProject.longDescription === 'object') {
        // Fallback pour format Tiptap
        const doc = apiProject.longDescription as { content?: { type: string; content?: { text?: string }[] }[] };
        descriptionLongue = (doc.content || [])
            .map((block) => {
                if (block.type === 'paragraph' || block.type === 'heading') {
                    const text = block.content?.map(c => c.text).filter(Boolean).join(' ') || '';
                    return { type: block.type as 'paragraph' | 'heading', text };
                }
                return null;
            })
            .filter((b): b is ContentBlock => b !== null && b.text.length > 0);
    }

    if (descriptionLongue.length === 0) {
        descriptionLongue = [{ type: 'paragraph', text: apiProject.shortDescription || 'Détails du projet à venir.' }];
    }

    // 2. Mapping des autres champs avec fallbacks élégants
    return {
        slug: apiProject.slug,
        categorie: apiProject.category || 'Général',
        lieu: apiProject.location || 'RDC',
        titre: apiProject.title,
        imageHero: apiProject.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        descriptionLongue,
        galerie: Array.isArray(apiProject.gallery) ? apiProject.gallery : []
    };
};

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function PortfolioDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    
    const [project, setProject] = useState<DisplayProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setError("Slug du projet manquant.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const apiData = await projectService.getBySlug(slug);
                setProject(formatProjectDetail(apiData));
            } catch (err) {
                console.error("Erreur chargement détail projet:", err);
                setError("Ce projet n'existe pas ou a été supprimé.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // ✅ ÉTAT DE CHARGEMENT AVEC SKELETONS
    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary">
                <HeroSkeleton />
                <TextSkeleton />
            </div>
        );
    }

    // État d'erreur
    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-primary p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-primary dark:text-white mb-2">Projet introuvable</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <Link to="/portfolio" className="px-6 py-2 bg-accent text-primary font-semibold rounded-full hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                    Retour aux réalisations <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* ✅ INJECTION SEO DYNAMIQUE POUR LE PROJET */}
            <SEO 
                title={`${project.titre} | Réalisations Panda Holding`}
                description={project.descriptionLongue[0]?.text || `Découvrez notre réalisation : ${project.titre}, un projet emblématique de Panda Holding en ${project.lieu}.`}
                path={`/portfolio/${project.slug}`}
                image={project.imageHero}
                type="website"
            />

            {/* ==========================================
                1. HERO SECTION
                ========================================== */}
            <section className="relative pt-20 pb-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                    <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs sm:text-sm">
                        <Link to="/" className="flex items-center gap-1 text-primary/70 dark:text-white/60 hover:text-accent transition-colors duration-300">
                            Accueil
                        </Link>
                        <span className="text-primary/30 dark:text-white/30">/</span>
                        <Link to="/portfolio" className="text-primary/70 dark:text-white/60 hover:text-accent transition-colors duration-300">
                            Réalisations
                        </Link>
                        <span className="text-primary/30 dark:text-white/30">/</span>
                        <span className="text-primary dark:text-white font-semibold truncate max-w-[150px] sm:max-w-none">
                            {project.titre}
                        </span>
                    </nav>
                </div>

                <div className="relative w-full h-[35vh] lg:h-[50vh] overflow-hidden">
                    <SafeImage 
                        src={project.imageHero}
                        alt={project.titre}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10">
                        <div className="container mx-auto max-w-5xl">
                            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm mb-3">
                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{project.lieu}</span>
                                <span className="mx-2">•</span>
                                <span className="px-2 py-0.5 bg-accent/90 text-primary font-bold rounded text-[10px] sm:text-xs uppercase">
                                    {project.categorie}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-4xl">
                                {project.titre}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==========================================
                2. CONTENU À GAUCHE + GALERIE STICKY À DROITE
                ========================================== */}
            <section className="py-16 lg:py-24 bg-white dark:bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                        
                        {/* Colonne Gauche : Contenu textuel */}
                        <div className="lg:col-span-7 space-y-6">
                            {project.descriptionLongue.map((block, index) => {
                                if (block.type === "paragraph") {
                                    return (
                                        <p key={index} className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {block.text}
                                        </p>
                                    );
                                }
                                if (block.type === "heading") {
                                    return (
                                        <h2 key={index} className="text-xl sm:text-2xl font-bold text-primary dark:text-white mt-8 mb-4">
                                            {block.text}
                                        </h2>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* Colonne Droite : Titre Statique + Galerie Sticky */}
                        {project.galerie.length > 0 && (
                            <div className="lg:col-span-5">
                                <div className="sticky top-24 space-y-5">
                                    <h2 className="text-xs font-bold text-accent uppercase tracking-wider">
                                        Galerie du projet
                                    </h2>

                                    {/* Image principale (1ère image) */}
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <SafeImage 
                                            src={project.galerie[0]} 
                                            alt="Vue principale"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Images secondaires (en grille de 3 colonnes) */}
                                    {project.galerie.length > 1 && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {project.galerie.slice(1, 4).map((img, index) => (
                                                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                                                    <SafeImage 
                                                        src={img} 
                                                        alt={`Vue ${index + 2}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* ==========================================
                3. CTA CONTACT
                ========================================== */}
            <section className="pb-16 lg:pb-24 bg-white dark:bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 bg-gray-50/50 dark:bg-white/5">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12">
                                <div className="flex-1 space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 dark:bg-accent/10 rounded-full border border-primary/10 dark:border-accent/20">
                                        <Phone className="w-3.5 h-3.5 text-primary dark:text-accent" />
                                        <span className="text-xs font-semibold text-primary dark:text-accent uppercase tracking-wider">
                                            Contactez-nous
                                        </span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-white leading-tight">
                                        Un projet similaire en tête ?
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Notre équipe d'experts est à votre disposition pour étudier vos besoins et concrétiser vos ambitions.
                                    </p>
                                </div>
                                
                                <div className="flex-shrink-0 w-full lg:w-auto">
                                    <Link 
                                        to="/contact"
                                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary dark:bg-accent text-white dark:text-primary font-semibold rounded-xl hover:bg-primary/90 dark:hover:bg-accent/90 transition-colors duration-300"
                                    >
                                        Discutons de votre projet
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}