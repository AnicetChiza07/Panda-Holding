import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonialService } from '../../services/testimonialService';
import type { Testimonial } from '../../services/testimonialService';
import { Pulse } from '../../components/common/Skeletons';

// ==========================================
// COMPOSANT CARTE TÉMOIGNAGE
// ==========================================
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="flex-shrink-0 w-[380px] sm:w-[420px]">
            <div className="min-h-[300px] p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm hover:border-secondary/50 dark:hover:border-secondary/30 transition-all duration-300 hover:shadow-xl flex flex-col justify-center">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${
                                        i < testimonial.rating 
                                            ? 'fill-[#F4A100] text-[#F4A100]' 
                                            : 'text-gray-300 dark:text-gray-600'
                                    }`} 
                                />
                            ))}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 dark:from-secondary/20 dark:to-accent/20 border border-secondary/20 dark:border-secondary/30 flex items-center justify-center">
                            <Quote className="w-4 h-4 text-secondary dark:text-secondary" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-light italic">
                            {testimonial.content}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-secondary/20 dark:border-secondary/30">
                            <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-primary dark:text-white truncate">{testimonial.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{testimonial.role}, {testimonial.company}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// COMPOSANT SKELETON
// ==========================================
function TestimonialCardSkeleton() {
    return (
        <div className="flex-shrink-0 w-[380px] sm:w-[420px]">
            <div className="min-h-[300px] p-6 rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white dark:bg-white/5 flex flex-col justify-center">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Pulse key={i} className="w-4 h-4 rounded-full" />
                            ))}
                        </div>
                        <Pulse className="w-10 h-10 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Pulse className="w-full h-4 rounded" />
                        <Pulse className="w-5/6 h-4 rounded" />
                        <Pulse className="w-4/6 h-4 rounded" />
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                        <Pulse className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                            <Pulse className="w-2/3 h-4 rounded" />
                            <Pulse className="w-1/2 h-3 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function TestimonialsMarquee() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // ✅ NOUVEAU : État d'erreur

    useEffect(() => {
        let isMounted = true;

        testimonialService.getActiveTestimonials()
            .then((data) => {
                if (isMounted) {
                    console.log('✅ Témoignages chargés:', data.length, 'éléments'); // ✅ LOG pour diagnostiquer
                    setTestimonials(data);
                    setError(null);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('❌ Erreur chargement témoignages:', err); // ✅ LOG détaillé
                    setError('Impossible de charger les témoignages');
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // ✅ 1. État de chargement (Skeleton)
    if (loading) {
        return (
            <section className="py-20 lg:py-24 bg-white/80 dark:bg-primary border-y border-gray-100 dark:border-white/5 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-2xl mx-auto text-center mb-16 space-y-4 animate-fadeInUp">
                        <Pulse className="w-32 h-8 rounded-full mx-auto" />
                        <Pulse className="w-3/4 h-10 rounded-lg mx-auto" />
                        <Pulse className="w-2/3 h-4 rounded mx-auto" />
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-20 lg:w-30 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none dark:from-primary dark:via-primary/80"></div>
                        <div className="absolute top-0 right-0 w-20 lg:w-30 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none dark:from-primary dark:via-primary/80"></div>
                        <div className="overflow-hidden">
                            <div className="flex gap-6 lg:gap-8 w-max items-center py-4 animate-fadeInUp delay-200">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <TestimonialCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ✅ 2. État d'erreur (Message visible)
    if (error) {
        return (
            <section className="py-20 lg:py-24 bg-white/80 dark:bg-primary border-y border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-200 dark:border-red-800">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
                                ERREUR
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary dark:text-white">
                            {error}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Veuillez rafraîchir la page ou réessayer plus tard.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // ✅ 3. État vide (Aucun témoignage actif)
    if (testimonials.length === 0) {
        console.log('⚠️ Aucun témoignage actif trouvé'); // ✅ LOG
        return (
            <section className="py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-full border border-gray-200 dark:border-white/20">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                TÉMOIGNAGES
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary dark:text-white">
                            Aucun témoignage pour le moment
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Les témoignages de nos clients seront bientôt disponibles.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // ✅ 4. Rendu normal
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-20 lg:py-24 bg-white/80 dark:bg-primary relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="max-w-2xl space-y-4 animate-fadeInUp">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                            TÉMOIGNAGES
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-white leading-tight">
                        Ce qu'ils disent <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">de nous</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Des retours d'expérience authentiques de ceux qui ont choisi de grandir et d'innover avec Panda Holding.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-scroll {
                    animation: scroll 40s linear infinite;
                }
                .animate-marquee-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute top-0 left-0 w-20 lg:w-30 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none dark:from-primary dark:via-primary/80"></div>
                <div className="absolute top-0 right-0 w-20 lg:w-30 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none dark:from-primary dark:via-primary/80"></div>

                <div className="overflow-hidden">
                    <div className="flex gap-6 lg:gap-8 animate-marquee-scroll w-max items-center py-4">
                        {duplicatedTestimonials.map((testimonial, index) => (
                            <TestimonialCard 
                                key={`${testimonial._id}-${index}`}
                                testimonial={testimonial}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}