import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { SafeImage } from '../components/common/SafeImage';
import { CardSkeleton } from '../components/common/Skeletons'; // ✅ Corrigé avec le 's'
import { articleService, type ApiArticle } from '../services/articleService';
import { SEO } from '../components/common/SEO';

// ==========================================
// TYPES (Adaptés pour le composant ArticleCard)
// ==========================================
interface Article {
    id: string;
    slug: string; // ✅ AJOUTÉ pour le routing strict
    isFeatured: boolean;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    author: string;
    authorInitials: string;
    image: string;
}

// ==========================================
// FONCTION DE MAPPING (Backend -> Frontend)
// ==========================================
const formatArticle = (apiArticle: ApiArticle): Article => {
    const authorName = apiArticle.author || 'Panda Holding';
    const initials = authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const dateStr = new Date(apiArticle.createdAt).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });

    return {
        id: apiArticle._id,
        slug: apiArticle.slug || apiArticle._id, // ✅ AJOUTÉ : fallback sur l'ID si le slug est manquant
        isFeatured: apiArticle.isFeatured || false,
        category: apiArticle.category || apiArticle.sector?.name || 'Actualité',
        title: apiArticle.title,
        excerpt: apiArticle.excerpt || apiArticle.description || 'Découvrez les détails de cette actualité.',
        date: dateStr,
        readTime: apiArticle.readTime || '3 min',
        author: authorName,
        authorInitials: initials,
        image: apiArticle.coverImage || apiArticle.image || 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
    };
};

// ==========================================
// COMPOSANT CARTE (Inchangé)
// ==========================================
export function ArticleCard({ article }: { article: Article }) {
    if (article.isFeatured) {
        return (
            <article className="group relative lg:col-span-2 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 animate-fadeInUp bg-primary">
                <div className="relative aspect-[16/9] lg:aspect-[2.4/1] overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <SafeImage 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent/90 text-primary backdrop-blur-md">
                            <Sparkles className="w-3 h-3" />
                            À la une
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20">
                            {article.category}
                        </span>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-2 mb-3">
                        {article.title}
                    </h3>

                    <p className="text-sm text-white/80 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-6">
                        {article.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-white">
                                        {article.authorInitials}
                                    </span>
                                </div>
                                <span className="hidden sm:inline">{article.author}</span>
                            </div>
                        </div>

                        <Link 
                            to={`/blog/${article.slug}`} // ✅ Maintenant 100% typé et sûr
                            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent transition-colors duration-300"
                        >
                            Lire en détails
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/40 animate-fadeInUp">
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <SafeImage 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent text-primary">
                        {article.category}
                    </span>
                </div>
            </div>
            
            <div className="flex flex-col flex-1 p-6">
                <h3 className="text-lg font-bold text-primary dark:text-white mb-3 leading-tight line-clamp-2 group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors duration-300">
                    {article.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-2 flex-1">
                    {article.excerpt}
                </p>
                
                <Link 
                    to={`/blog/${article.slug}`} // ✅ Maintenant 100% typé et sûr
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/5 dark:bg-white/5 rounded-full text-sm font-semibold text-primary dark:text-white hover:bg-accent hover:text-primary transition-all duration-300 group/btn w-fit mb-6"
                >
                    Lire en détails
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/60 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{article.readTime}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary/20 dark:bg-secondary/30 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary dark:text-secondary">
                                {article.authorInitials}
                            </span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium hidden sm:block">
                            {article.author}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

// ==========================================
// PAGE PRINCIPALE (Connectée au Backend + SKELETON)
// ==========================================
export function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [visibleCount, setVisibleCount] = useState(10);
    
    // États pour la gestion des données API
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Chargement des données au montage du composant
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiData = await articleService.getAll();
                const formattedData = apiData.map(formatArticle);
                setArticles(formattedData);
            } catch (err) {
                console.error("Erreur chargement articles:", err);
                setError("Impossible de charger les articles pour le moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Logique de filtrage
    const filteredArticles = activeCategory === "Tous" 
        ? articles 
        : articles.filter(article => article.category === activeCategory);

    // On s'assure que l'article "À la une" est le premier de la liste filtrée
    const featuredArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
    
    // On exclut l'article à la une de la liste standard pour éviter les doublons
    const standardArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);
    const visibleArticles = standardArticles.slice(0, visibleCount);
    const hasMoreArticles = visibleCount < standardArticles.length;

    const loadMoreArticles = () => {
        setVisibleCount(prev => prev + 3);
    };

    // Extraction dynamique des catégories depuis les vraies données
    const dynamicCategories = ["Tous", ...Array.from(new Set(articles.map(a => a.category)))];

    // ✅ ÉTAT DE CHARGEMENT AVEC SKELETONS
    if (loading) {
        return (
            <>
                <SEO 
                    title="Actualités, Analyses et Insights | Blog Panda Holding"
                    description="Restez informé des dernières actualités économiques, analyses de marché et réflexions sur l'entrepreneuriat et le développement en RDC par les experts de Panda Holding."
                    path="/blog"
                />

                <PageHero
                    title="Actualités"
                    highlight="& Analyses"
                    description="Chargement des articles..."
                    breadcrumbs={[
                        { label: "Accueil", path: "/" },
                        { label: "Actualités" }
                    ]}
                />
                <section className="py-24 lg:py-32 bg-white dark:bg-primary relative overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Filtres Skeleton */}
                        <div className="flex flex-wrap gap-3 mb-16 animate-fadeInUp">
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

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-primary p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-primary dark:text-white mb-2">Oups !</h2>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
        );
    }

    return (
        <>
            <PageHero
                title="Actualités"
                highlight="& Analyses"
                description="Nos réflexions, retours d'expérience et analyses sur l'entrepreneuriat et le développement en RDC."
                breadcrumbs={[
                    { label: "Accueil", path: "/" },
                    { label: "Actualités" }
                ]}
            />

            <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-black/10 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* FILTRES DYNAMIQUES */}
                    <div className="flex flex-wrap gap-3 mb-16 animate-fadeInUp">
                        {dynamicCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setActiveCategory(category);
                                    setVisibleCount(10);
                                }}
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

                    {/* GRILLE DES ARTICLES */}
                    {articles.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>Aucun article publié pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {featuredArticle && <ArticleCard article={featuredArticle} />}
                            {visibleArticles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    )}

                    {/* BOUTON "VOIR PLUS" */}
                    {hasMoreArticles && (
                        <div className="text-center mt-16 animate-fadeInUp">
                            <button 
                                onClick={loadMoreArticles}
                                className="inline-flex items-center gap-3 pr-1.5 pl-6 py-1.5 bg-accent text-primary font-medium rounded-full hover:bg-accent/90 hover:scale-105 transition-all duration-300"
                            >
                                Voir plus d'articles
                                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}