import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react'; // ✅ Loader2 supprimé
import { faqService, type ApiFaq } from '../../services/faqService';

// ==========================================
// INTERFACES TIPTAP (Strictement typées)
// ==========================================
interface TiptapTextNode {
    type: 'text';
    text: string;
}

interface TiptapBlockNode {
    type: string;
    content?: (TiptapBlockNode | TiptapTextNode)[];
}

type TiptapNode = TiptapBlockNode | TiptapTextNode;

interface TiptapDocument {
    type: 'doc';
    content?: TiptapBlockNode[];
}

// ==========================================
// TYPE GUARD (La clé pour éviter le 'any')
// ==========================================
const isTextNode = (node: TiptapNode): node is TiptapTextNode => {
    return node.type === 'text';
};

// Fonction utilitaire pour extraire le texte de manière récursive et 100% typée
const extractTextFromTiptap = (node: TiptapNode | undefined): string => {
    if (!node) return '';
    
    if (isTextNode(node)) {
        return node.text;
    }
    
    if (node.content && Array.isArray(node.content)) {
        return node.content
            .map(extractTextFromTiptap)
            .filter(text => text.trim() !== '')
            .join(' ');
    }

    return '';
};

// ==========================================
// TYPES & MAPPING
// ==========================================
interface DisplayFaq {
    id: string;
    question: string;
    answer: string;
}

const formatFaq = (apiFaq: ApiFaq): DisplayFaq => {
    let answerText = '';

    if (typeof apiFaq.answer === 'string') {
        answerText = apiFaq.answer;
    } else if (apiFaq.answer && typeof apiFaq.answer === 'object') {
        const doc = apiFaq.answer as TiptapDocument;
        answerText = doc.content 
            ? doc.content.map(block => extractTextFromTiptap(block)).join('\n')
            : 'Voir les détails sur le site.';
    }

    return {
        id: apiFaq._id,
        question: apiFaq.question || 'Question sans titre',
        answer: answerText || 'Aucune réponse disponible pour le moment.'
    };
};

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function FAQSection() {
    const [openId, setOpenId] = useState<string | null>(null);
    const [faqs, setFaqs] = useState<DisplayFaq[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                setLoading(true);
                const apiData = await faqService.getAll();
                setFaqs(apiData.map(formatFaq));
            } catch (error) {
                console.error("Erreur chargement FAQ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const toggleFAQ = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    // ✅ État de chargement avec Skeleton (Remplace le simple spinner)
    if (loading) {
        return (
            <section className="py-24 lg:py-32 bg-gray-50/40 dark:bg-gray-900/40 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* En-tête Skeleton */}
                    <div className="max-w-3xl mx-auto text-center mb-16 space-y-4 animate-fadeInUp">
                        <div className="w-40 h-8 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full mx-auto" />
                        <div className="w-3/4 h-10 bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg mx-auto" />
                        <div className="w-20 h-1 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full mx-auto" />
                    </div>

                    {/* Accordéons Skeleton (4 items) */}
                    <div className="max-w-3xl mx-auto space-y-4 animate-fadeInUp delay-200">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
                                <div className="px-6 py-5 flex items-center justify-between">
                                    <div className="w-3/4 h-5 bg-gray-200 dark:bg-white/10 animate-pulse rounded" />
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // État vide
    if (faqs.length === 0) {
        return (
            <section className="py-24 lg:py-32 bg-gray-50/40 dark:bg-gray-900/40 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 mx-auto">
                        <HelpCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aucune question fréquente pour le moment</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">N'hésitez pas à nous contacter directement pour toute information.</p>
                </div>
            </section>
        );
    }

    // Rendu principal
    return (
        <section className="py-24 lg:py-32 bg-gray-50/40 dark:bg-gray-900/40 relative overflow-hidden">
            
            {/* Lueurs décoratives */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* EN-TÊTE DE SECTION - CENTRÉ */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4 animate-fadeInUp">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                            QUESTIONS FRÉQUENTES
                        </span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white leading-tight">
                        Tout ce que vous devez savoir sur{' '}
                        <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            Panda Holding
                        </span>
                    </h2>
                    
                    <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent rounded-full mx-auto"></div>
                </div>

                {/* FAQ - COLONNE UNIQUE CENTRÉE */}
                <div className="max-w-3xl mx-auto space-y-4 animate-fadeInUp delay-200">
                    {faqs.map((item, index) => {
                        const isOpen = openId === item.id;
                        
                        return (
                            <div 
                                key={item.id}
                                className="group rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Question - Toujours visible */}
                                <button
                                    onClick={() => toggleFAQ(item.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors duration-300"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-base font-medium text-primary dark:text-white pr-8">
                                        {item.question}
                                    </span>
                                    
                                    {/* Icône flèche */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-5 h-5 text-accent" />
                                    </div>
                                </button>

                                {/* Réponse - Animée */}
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-6 pb-5 pt-2">
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent mb-4"></div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}