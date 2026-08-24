import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'; // ✅ Loader2 supprimé
import { SafeImage } from '../common/SafeImage';
import { CardSkeleton } from '../common/Skeletons'; // ✅ AJOUT DU SKELETON
import { carouselService, type ApiCarouselSlide } from '../../services/carouselService';

// ==========================================
// TYPES & MAPPING
// ==========================================
interface DisplaySlide {
    id: string;
    title: string;
    description: string;
    image: string;
}

const formatSlide = (apiSlide: ApiCarouselSlide): DisplaySlide => ({
    id: apiSlide._id,
    title: apiSlide.title || 'Action sur le terrain',
    description: apiSlide.description || 'Découvrez notre impact',
    image: apiSlide.image || 'https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg?auto=compress&cs=tinysrgb&w=800'
});

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function ActivitiesCarousel() {
    const [slides, setSlides] = useState<DisplaySlide[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesInView, setSlidesInView] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const autoPlayRef = useRef<number | null>(null);

    // 1. Chargement des données
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);
                const apiData = await carouselService.getAll();
                setSlides(apiData.map(formatSlide));
            } catch (error) {
                console.error("Erreur chargement carrousel:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    // 2. Gestion responsive
    useEffect(() => {
        const updateSlidesInView = () => {
            if (window.innerWidth < 640) setSlidesInView(1);
            else if (window.innerWidth < 1024) setSlidesInView(2);
            else setSlidesInView(3);
        };
        updateSlidesInView();
        window.addEventListener('resize', updateSlidesInView);
        return () => window.removeEventListener('resize', updateSlidesInView);
    }, []);

    // 3. Logique de "Snap-back" pour la boucle infinie
    useEffect(() => {
        if (slides.length > 0 && currentIndex >= slides.length) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, slides.length]);

    // 4. Défilement automatique
    useEffect(() => {
        if (slides.length <= 1) return;

        autoPlayRef.current = window.setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((prev) => prev + 1);
        }, 4000);

        return () => {
            if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
        };
    }, [slides.length]);

    // Fonctions de navigation
    const pauseAutoPlay = () => {
        if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    };

    const resumeAutoPlay = () => {
        if (slides.length <= 1) return;
        if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
        autoPlayRef.current = window.setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((prev) => prev + 1);
        }, 4000);
    };

    const scrollPrev = () => {
        pauseAutoPlay();
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        resumeAutoPlay();
    };

    const scrollNext = () => {
        pauseAutoPlay();
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
        resumeAutoPlay();
    };

    const goToSlide = (index: number) => {
        pauseAutoPlay();
        setIsTransitioning(true);
        setCurrentIndex(index);
        resumeAutoPlay();
    };

    // Tableau étendu pour la boucle infinie
    const slidesToClone = Math.min(3, slides.length);
    const extendedSlides = [...slides, ...slides.slice(0, slidesToClone)];
    const translateX = `-${currentIndex * (100 / slidesInView)}%`;

    // ==========================================
    // RENDU : État de chargement (Skeleton)
    // ==========================================
    if (loading) {
        return (
            <section className="py-24 lg:py-32 bg-white dark:bg-primary relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* En-tête Skeleton */}
                    <div className="max-w-2xl mb-12 lg:mb-16 space-y-4 animate-fadeInUp">
                        <div className="w-32 h-8 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full" />
                        <div className="w-3/4 h-10 bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg" />
                        <div className="w-full h-4 bg-gray-200 dark:bg-white/10 animate-pulse rounded" />
                    </div>

                    {/* Grille de Cartes Skeleton (simule les 3 slides visibles) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Navigation Skeleton */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full" />
                        <div className="flex gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="w-8 h-2.5 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full" />
                            ))}
                        </div>
                        <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 animate-pulse rounded-full" />
                    </div>
                </div>
            </section>
        );
    }

    // ==========================================
    // RENDU : État vide
    // ==========================================
    if (slides.length === 0) {
        return (
            <section className="py-24 lg:py-32 bg-white dark:bg-primary relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aucune image pour le moment</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Les actions sur le terrain apparaîtront ici dès qu'elles seront ajoutées.</p>
                </div>
            </section>
        );
    }

    // ==========================================
    // RENDU : Carrousel actif
    // ==========================================
    return (
        <section
            className="py-24 lg:py-32 bg-white dark:bg-primary relative overflow-hidden"
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
        >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* En-tête */}
                <div className="max-w-2xl mb-12 lg:mb-16 space-y-4 animate-fadeInUp">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                            SUR LE TERRAIN
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-white leading-tight">
                        Nos actions <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">en images</span>
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Découvrez nos projets et initiatives à travers la RDC. Chaque image raconte une histoire d'impact et de transformation.
                    </p>
                </div>

                {/* Carrousel */}
                <div className="relative" onMouseEnter={pauseAutoPlay} onMouseLeave={resumeAutoPlay}>
                    <div className="overflow-hidden rounded-2xl">
                        <div
                            className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                            style={{ transform: `translateX(${translateX})` }}
                        >
                            {extendedSlides.map((slide, index) => (
                                <div
                                    key={`${slide.id}-${index}`}
                                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 pr-4 lg:pr-6"
                                >
                                    <div className="relative aspect-[4/3] sm:aspect-[3/3] rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 h-full group/card">
                                        <SafeImage
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-300"></div>

                                        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-bold text-sm lg:text-base mb-1 leading-tight">
                                                {slide.title}
                                            </h3>
                                            <p className="text-white/80 text-xs opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-75">
                                                {slide.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation : Points + Flèches */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={scrollPrev}
                        className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-primary dark:text-white border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none"
                        aria-label="Image précédente"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    (currentIndex % slides.length) === index
                                        ? 'bg-accent w-8'
                                        : 'bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40 w-2.5'
                                }`}
                                aria-label={`Aller à l'image ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={scrollNext}
                        className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-primary dark:text-white border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none"
                        aria-label="Image suivante"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}