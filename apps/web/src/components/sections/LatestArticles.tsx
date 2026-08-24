import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react'; // ✅ Loader2 supprimé
import { SafeImage } from '../common/SafeImage';
import { CardSkeleton } from '../common/Skeletons'; // ✅ AJOUT DU SKELETON
import { articleService, type ApiArticle } from '../../services/articleService';

// ==========================================
// TYPES (Pour correspondre au design de la carte)
// ==========================================
interface DisplayArticle {
    id: string;
    slug: string;
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
const formatArticle = (apiArticle: ApiArticle): DisplayArticle => {
    const authorName = apiArticle.author || 'Panda Holding';
    const initials = authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const dateStr = new Date(apiArticle.createdAt).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });

    return {
        id: apiArticle._id,
        slug: apiArticle.slug || apiArticle._id, // Fallback sur l'ID si pas de slug
        category: apiArticle.category || apiArticle.sector?.name || 'Actualité',
        title: apiArticle.title,
        excerpt: apiArticle.excerpt || apiArticle.description || 'Découvrez les détails de cette actualité.',
        date: dateStr,
        readTime: apiArticle.readTime || '3 min',
        author: authorName,
        authorInitials: initials,
        image: apiArticle.coverImage || apiArticle.image || 'https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
};

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function LatestArticles() {
    const [articles, setArticles] = useState<DisplayArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestArticles = async () => {
            try {
                setLoading(true);
                const apiData = await articleService.getLatest();
                const formattedData = apiData.map(formatArticle);
                setArticles(formattedData);
            } catch (error) {
                console.error("Erreur chargement derniers articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestArticles();
    }, []);

    // ✅ État de chargement avec Skeleton (Remplace le simple spinner)
    if (loading) {
        return (
            <section className="py-24 lg:py-32 bg-gray-50/40 dark:bg-gray-900/40 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête Skeleton */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16 animate-fadeInUp">
                        <div className="max-w-2xl space-y-4">
                            <div className="w-32 h-8 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full" />
                            <div className="w-3/4 h-10 bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg" />
                            <div className="w-full h-4 bg-gray-200 dark:bg-white/10 animate-pulse rounded" />
                        </div>
                        <div className="w-40 h-10 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full hidden lg:block" />
                    </div>

                    {/* Grille de Cartes Skeleton (3 cartes pour les derniers articles) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 lg:py-32 bg-gray-50/40 dark:bg-gray-900/40 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ==========================================
                    EN-TÊTE DE SECTION
                    ========================================== */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
                    <div className="max-w-2xl space-y-4 animate-fadeInUp">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                                ACTUALITÉS
                            </span>
                        </div>
                        
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-white leading-tight">
                            Derniers <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">articles</span>
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                            Découvrez nos analyses, actualités et réflexions sur l'entrepreneuriat et le développement en RDC.
                        </p>
                    </div>
                    
                    <div className="animate-fadeInUp delay-200">
                        <Link 
                            to="/blog" 
                            className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-white/20 rounded-full text-sm font-semibold text-gray-700 dark:text-white hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white transition-all duration-300 group"
                        >
                            Voir tous les articles
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* ==========================================
                    GRILLE DES ARTICLES
                    ========================================== */}
                {articles.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
                        <p className="text-gray-500 dark:text-gray-400">Aucun article publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {articles.map((article, index) => (
                            <article 
                                key={article.id}
                                className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/40 animate-fadeInUp"
                                style={{ animationDelay: `${(index + 1) * 100}ms` }}
                            >
                                {/* Image avec catégorie en haut à droite */}
                                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <SafeImage 
                                        src={article.image} 
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="absolute top-4 right-4">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent text-primary shadow-sm">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Contenu de la carte */}
                                <div className="flex flex-col flex-1 p-6">
                                    <h3 className="text-lg font-bold text-primary dark:text-white mb-3 leading-tight line-clamp-2 group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors duration-300">
                                        {article.title}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-2 flex-1">
                                        {article.excerpt}
                                    </p>
                                    
                                    <Link 
                                        to={`/blog/${article.slug}`}
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
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                {article.author}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}