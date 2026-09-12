import { useState, useEffect } from 'react';
import type { ElementType } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowRight, CheckCircle, Briefcase, TrendingUp, Building2, 
    Phone, AlertCircle 
} from 'lucide-react';
import { SafeImage } from '../components/common/SafeImage'; 
import { sectorService, type ApiSector } from '../services/sectorService';
import { HeroSkeleton, TextSkeleton } from '../components/common/Skeletons';
// ✅ AJOUT DE L'IMPORT SEO
import { SEO } from '../components/common/SEO';

// ==========================================
// TYPES STRICTS
// ==========================================
type ContentBlock = 
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string };

interface StatItem {
    label: string;
    value: string;
    icon: ElementType;
}

interface DisplaySector {
    slug: string;
    nom: string;
    image: string;
    descriptionCourte: string;
    descriptionLongue: ContentBlock[];
    stats: StatItem[];
    sousSecteurs: string[];
    realisations: string[];
}

// ==========================================
// FONCTION DE MAPPING (Intelligente et tolérante)
// ==========================================
const formatSector = (apiSector: ApiSector): DisplaySector => {
    // 1. Parsing de la description longue
    let descriptionLongue: ContentBlock[] = [];
    if (typeof apiSector.longDescription === 'string') {
        descriptionLongue = [{ type: 'paragraph', text: apiSector.longDescription }];
    } else if (apiSector.longDescription && typeof apiSector.longDescription === 'object') {
        const doc = apiSector.longDescription as { content?: { type: string; content?: { text?: string }[] }[] };
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
        descriptionLongue = [{ type: 'paragraph', text: apiSector.shortDescription || 'Aucune description disponible.' }];
    }

    // 2. Statistiques (Uniquement si présentes en DB)
    const stats: StatItem[] = [];
    if (apiSector.projectsCount) stats.push({ label: "Projets", value: String(apiSector.projectsCount), icon: Building2 });
    if (apiSector.investmentAmount) stats.push({ label: "Investissement", value: apiSector.investmentAmount, icon: TrendingUp });

    // 3. ✅ MAPPING INTELLIGENT : On vérifie les deux noms de champs possibles
    const sousSecteurs = (Array.isArray(apiSector.expertises) && apiSector.expertises.length > 0) 
        ? apiSector.expertises 
        : (Array.isArray(apiSector.subSectors) ? apiSector.subSectors : []);

    const realisations = (Array.isArray(apiSector.images) && apiSector.images.length > 0) 
        ? apiSector.images 
        : (Array.isArray(apiSector.realizations) ? apiSector.realizations : []);

    return {
        slug: apiSector.slug,
        nom: apiSector.name,
        image: apiSector.coverImage || apiSector.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
        descriptionCourte: apiSector.shortDescription || 'Découvrez notre approche stratégique.',
        descriptionLongue,
        stats,
        sousSecteurs,
        realisations
    };
};

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function SectorDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    
    const [sector, setSector] = useState<DisplaySector | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setError("Slug du secteur manquant.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const apiData = await sectorService.getBySlug(slug);
                setSector(formatSector(apiData));
            } catch (err) {
                console.error("Erreur chargement détail secteur:", err);
                setError("Ce secteur n'existe pas ou a été supprimé.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary">
                <HeroSkeleton />
                <TextSkeleton />
            </div>
        );
    }

    if (error || !sector) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-primary p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-primary dark:text-white mb-2">Secteur introuvable</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <Link to="/sectors" className="px-6 py-2 bg-accent text-primary font-semibold rounded-full hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                    Retour aux secteurs <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* ✅ INJECTION SEO DYNAMIQUE POUR LE SECTEUR */}
            <SEO 
                title={`${sector.nom} | Nos Secteurs d'Activité - Panda Holding`}
                description={sector.descriptionCourte}
                path={`/sectors/${sector.slug}`}
                image={sector.image}
                type="website"
            />

            {/* HERO IMMERSIF */}
            <section className="relative pt-20 pb-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                    <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs sm:text-sm">
                        <Link to="/" className="flex items-center gap-1 text-primary/70 dark:text-white/60 hover:text-accent transition-colors duration-300">Accueil</Link>
                        <span className="text-primary/30 dark:text-white/30">/</span>
                        <Link to="/sectors" className="text-primary/70 dark:text-white/60 hover:text-accent transition-colors duration-300">Secteurs</Link>
                        <span className="text-primary/30 dark:text-white/30">/</span>
                        <span className="text-primary dark:text-white font-semibold truncate max-w-[150px] sm:max-w-none">{sector.nom}</span>
                    </nav>
                </div>

                <div className="relative w-full h-[35vh] lg:h-[50vh] overflow-hidden">
                    <SafeImage src={sector.image} alt={sector.nom} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10">
                        <div className="container mx-auto max-w-5xl">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-4xl mb-3">{sector.nom}</h1>
                            <p className="text-sm sm:text-base text-white/80 max-w-3xl leading-relaxed">{sector.descriptionCourte}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENU PRINCIPAL */}
            <section className="py-16 lg:py-24 bg-white dark:bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-16">
                        
                        {/* 1. Description Longue */}
                        <div className="space-y-6">
                            {sector.descriptionLongue.map((block, index) => {
                                if (block.type === "paragraph") return <p key={index} className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">{block.text}</p>;
                                if (block.type === "heading") return <h2 key={index} className="text-xl sm:text-2xl font-bold text-primary dark:text-white mt-8 mb-4">{block.text}</h2>;
                                return null;
                            })}
                        </div>

                        {/* 2. Statistiques Clés (Si présentes) */}
                        {sector.stats.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {sector.stats.map((stat, index) => {
                                    const IconComponent = stat.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-accent/10 flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-5 h-5 text-primary dark:text-accent" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xl sm:text-2xl font-bold text-primary dark:text-white leading-none">{stat.value}</p>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">{stat.label}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 3. Domaines d'expertise / Sous-secteurs */}
                        {sector.sousSecteurs.length > 0 && (
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary dark:text-accent" />
                                    Nos domaines d'intervention
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {sector.sousSecteurs.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                            <CheckCircle className="w-4 h-4 text-primary dark:text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Galerie / Réalisations */}
                        {sector.realisations.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-lg sm:text-xl font-bold text-primary dark:text-white">
                                    Nos réalisations dans ce secteur
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                    {sector.realisations.map((img, index) => (
                                        <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                                            <SafeImage 
                                                src={img} 
                                                alt={`Réalisation ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. Bannière CTA */}
                        <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 bg-gray-50/50 dark:bg-white/5">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12">
                                <div className="flex-1 space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 dark:bg-accent/10 rounded-full border border-primary/10 dark:border-accent/20">
                                        <Phone className="w-3.5 h-3.5 text-primary dark:text-accent" />
                                        <span className="text-xs font-semibold text-primary dark:text-accent uppercase tracking-wider">Contactez-nous</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-white leading-tight">
                                        Vous avez un projet dans le secteur de l'<span className="text-primary dark:text-accent">{sector.nom.toLowerCase()}</span> ?
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Notre équipe d'experts est à votre disposition pour étudier vos besoins et concrétiser vos ambitions.
                                    </p>
                                </div>
                                <div className="flex-shrink-0 w-full lg:w-auto">
                                    <Link to="/contact" className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary dark:bg-accent text-white dark:text-primary font-semibold rounded-xl hover:bg-primary/90 dark:hover:bg-accent/90 transition-colors duration-300">
                                        Discutons de votre projet <ArrowRight className="w-4 h-4" />
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