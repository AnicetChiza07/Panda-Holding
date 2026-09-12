import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, Home, AlertCircle } from 'lucide-react';
import { SafeImage } from '../components/common/SafeImage'; 
import { articleService, type ApiArticle } from '../services/articleService';
import { ArticleCard } from './BlogPage'; 
import { HeroSkeleton, TextSkeleton } from '../components/common/Skeletons'; 
import { SEO } from '../components/common/SEO'; // ✅ Déjà importé

// ==========================================
// TYPES POUR LE CONTENU RICHE
// ==========================================
type ContentBlock = 
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'image'; src: string; caption?: string }
    | { type: 'quote'; text: string; author?: string; role?: string };

interface DisplayArticle {
    id: string;
    slug: string;
    isFeatured: boolean;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    author: string;
    authorInitials: string;
    image: string;
    authorRole: string;
    content: ContentBlock[];
}

// ==========================================
// FONCTION DE MAPPING SÉCURISÉE
// ==========================================
const formatArticle = (apiArticle: ApiArticle): DisplayArticle => {
    const authorName = apiArticle.author || 'Panda Holding';
    const initials = authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const dateStr = new Date(apiArticle.createdAt).toLocaleDateString('fr-FR', { 
        day: 'numeric', month: 'long', year: 'numeric' 
    });

    let contentBlocks: ContentBlock[] = [{ type: 'paragraph', text: apiArticle.description || apiArticle.excerpt || 'Contenu de l\'article.' }];
    
    if (Array.isArray(apiArticle.content)) {
        contentBlocks = apiArticle.content.map((block: unknown) => {
            const b = block as Record<string, unknown>;
            if (b.type === 'paragraph' && typeof b.text === 'string') return { type: 'paragraph' as const, text: b.text };
            if (b.type === 'heading' && typeof b.text === 'string') return { type: 'heading' as const, text: b.text };
            if (b.type === 'image' && typeof b.src === 'string') return { type: 'image' as const, src: b.src, caption: b.caption as string | undefined };
            if (b.type === 'quote' && typeof b.text === 'string') return { type: 'quote' as const, text: b.text, author: b.author as string | undefined, role: b.role as string | undefined };
            return { type: 'paragraph' as const, text: String(b.text || '') };
        }) as ContentBlock[];
    }

    return {
        id: apiArticle._id,
        slug: apiArticle.slug || apiArticle._id,
        isFeatured: apiArticle.isFeatured || false,
        category: apiArticle.category || apiArticle.sector?.name || 'Actualité',
        title: apiArticle.title,
        excerpt: apiArticle.excerpt || '',
        date: dateStr,
        readTime: apiArticle.readTime || '5 min',
        author: authorName,
        authorRole: apiArticle.authorRole || 'Panda Holding',
        authorInitials: initials,
        image: apiArticle.coverImage || apiArticle.image || 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
        content: contentBlocks
    };
};

// Icônes réseaux sociaux
const FacebookIcon = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const TwitterIcon = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
const LinkedinIcon = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>);

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>();

    const [article, setArticle] = useState<DisplayArticle | null>(null);
    const [similarArticles, setSimilarArticles] = useState<DisplayArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setError("Slug de l'article manquant.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const apiArticle = await articleService.getBySlug(slug);
                const formattedArticle = formatArticle(apiArticle);
                setArticle(formattedArticle);

                const allArticles = await articleService.getAll();
                const similar = allArticles
                    .filter(a => a._id !== apiArticle._id && (a.category === apiArticle.category || a.sector?.name === apiArticle.category))
                    .slice(0, 3)
                    .map(formatArticle);
                
                if (similar.length < 3) {
                    const latest = await articleService.getLatest();
                    const fallbackSimilar = latest
                        .filter(a => a._id !== apiArticle._id && !similar.some(s => s.id === a._id))
                        .slice(0, 3 - similar.length)
                        .map(formatArticle);
                    setSimilarArticles([...similar, ...fallbackSimilar]);
                } else {
                    setSimilarArticles(similar);
                }

            } catch (err) {
                console.error("Erreur chargement détail article:", err);
                setError("Cet article n'existe pas ou a été supprimé.");
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

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-primary p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-primary dark:text-white mb-2">Article introuvable</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Désolé, nous n'avons pas pu trouver cet article."}</p>
                <Link to="/blog" className="px-6 py-2 bg-accent text-primary font-semibold rounded-full hover:bg-accent/90 transition-colors">
                    Retour aux actualités
                </Link>
            </div>
        );
    }

    const renderContentBlock = (block: ContentBlock, index: number) => {
        switch (block.type) {
            case "paragraph":
                return <p key={index} className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">{block.text}</p>;
            case "heading":
                return <h2 key={index} className="text-2xl lg:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">{block.text}</h2>;
            case "image":
                return (
                    <figure key={index} className="my-12">
                        <SafeImage src={block.src} alt={block.caption || article.title} className="w-full rounded-2xl shadow-lg" />
                        {block.caption && <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic">{block.caption}</figcaption>}
                    </figure>
                );
            case "quote":
                return (
                    <blockquote key={index} className="my-12 pl-6 border-l-4 border-accent bg-gray-50 dark:bg-white/5 rounded-r-2xl py-6 pr-6">
                        <p className="text-base lg:text-lg text-primary dark:text-white italic leading-relaxed mb-4">"{block.text}"</p>
                        <footer className="text-sm text-gray-600 dark:text-gray-400 font-medium">— {block.author}, {block.role}</footer>
                    </blockquote>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* ✅ INJECTION SEO DYNAMIQUE POUR L'ARTICLE */}
            <SEO 
                title={`${article.title} | Actualités Panda Holding`}
                description={article.excerpt || `Découvrez les détails de l'article : ${article.title} sur Panda Holding.`}
                path={`/blog/${article.slug}`}
                image={article.image}
                type="article"
            />

            {/* HERO DE L'ARTICLE */}
            <section className="relative pt-20 pb-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                    <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs sm:text-sm">
                        <Link to="/" className="flex items-center gap-1 text-primary/70 dark:text-white/60 hover:text-accent transition-colors duration-300">
                            <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Accueil</span>
                        </Link>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-primary/30 dark:text-white/30" />
                        <Link to="/blog" className="text-primary/70 dark:text-white/60 hover:text-accent transition-colors duration-300">Actualités</Link>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-primary/30 dark:text-white/30" />
                        <span className="text-primary dark:text-white font-semibold truncate max-w-[150px] sm:max-w-none">{article.category}</span>
                    </nav>
                </div>

                <div className="relative w-full h-[35vh] lg:h-[50vh] overflow-hidden">
                    <SafeImage src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 pb-6 sm:p-6 lg:p-10">
                        <div className="container mx-auto max-w-5xl">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
                                    <span className="px-2 sm:px-3 py-1 bg-accent/90 text-primary font-bold rounded-full text-[10px] sm:text-xs uppercase tracking-wider">{article.category}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 sm:w-4 sm:h-4" />{article.date}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 sm:w-4 sm:h-4" />{article.readTime}</span>
                                </div>
                                <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight max-w-4xl">{article.title}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENU DE L'ARTICLE */}
            <section className="py-16 lg:py-24 bg-white dark:bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {article.content.map((block, index) => renderContentBlock(block, index))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-primary dark:text-white">Partager cet article</p>
                                <div className="flex items-center gap-3">
                                    <button className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center hover:bg-accent/90 hover:scale-110 transition-all duration-300" aria-label="Facebook"><FacebookIcon /></button>
                                    <button className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center hover:bg-accent/90 hover:scale-110 transition-all duration-300" aria-label="Twitter"><TwitterIcon /></button>
                                    <button className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center hover:bg-accent/90 hover:scale-110 transition-all duration-300" aria-label="LinkedIn"><LinkedinIcon /></button>
                                </div>
                            </div>
                        </div>

                        <div className="my-16 border-t border-gray-200 dark:border-white/10"></div>

                        <div className="text-center mb-16">
                            <div className="inline-flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center">
                                    <span className="text-2xl font-bold text-accent">{article.authorInitials}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-primary dark:text-white">{article.author}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{article.authorRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ARTICLES SIMILAIRES */}
            {similarArticles.length > 0 && (
                <section className="py-16 lg:py-24 bg-gray-50/40 dark:bg-gray-900/40">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20 mb-4">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                                <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">ARTICLES SIMILAIRES</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white">Vous pourriez aussi aimer</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {similarArticles.map((similarArticle) => (
                                <ArticleCard key={similarArticle.id} article={similarArticle} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}