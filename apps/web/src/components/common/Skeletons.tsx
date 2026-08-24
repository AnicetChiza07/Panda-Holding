// Composant de base pour un bloc gris qui pulse
const Pulse = ({ className = "" }: { className?: string }) => (
    <div className={`bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg ${className}`}></div>
);

// 1. Skeleton pour les cartes (Blog, Portfolio, Secteurs)
export function CardSkeleton() {
    return (
        <div className="flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden h-full">
            {/* Image placeholder */}
            <div className="aspect-[4/3] w-full bg-gray-200 dark:bg-white/10 animate-pulse" />
            
            <div className="flex flex-col flex-1 p-6 space-y-4">
                {/* Lieu / Catégorie */}
                <div className="flex items-center gap-2">
                    <Pulse className="w-3 h-3 rounded-full" />
                    <Pulse className="w-24 h-3" />
                </div>
                {/* Titre */}
                <Pulse className="w-3/4 h-6" />
                {/* Description */}
                <div className="space-y-2 mt-auto">
                    <Pulse className="w-full h-3" />
                    <Pulse className="w-5/6 h-3" />
                </div>
                {/* Bouton/Lien */}
                <div className="pt-4">
                    <Pulse className="w-32 h-4" />
                </div>
            </div>
        </div>
    );
}

// 2. Skeleton pour le Hero des pages détail
export function HeroSkeleton() {
    return (
        <div className="relative pt-20 pb-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2">
                    <Pulse className="w-16 h-3" />
                    <Pulse className="w-2 h-3 rounded-full" />
                    <Pulse className="w-20 h-3" />
                </div>
            </div>
            {/* Image de couverture */}
            <div className="relative w-full h-[35vh] lg:h-[50vh] bg-gray-200 dark:bg-white/10 animate-pulse overflow-hidden">
                {/* Contenu en bas */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10">
                    <div className="container mx-auto max-w-5xl space-y-4">
                        <div className="flex items-center gap-2">
                            <Pulse className="w-3 h-3 rounded-full" />
                            <Pulse className="w-24 h-3" />
                        </div>
                        <Pulse className="w-2/3 h-8 sm:h-10" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// 3. Skeleton pour les blocs de texte (Paragraphes et Titres)
export function TextSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4 sm:px-6 lg:px-8 py-12">
            <Pulse className="w-1/3 h-6" /> {/* Petit titre */}
            <Pulse className="w-full h-4" />
            <Pulse className="w-full h-4" />
            <Pulse className="w-5/6 h-4" />
            
            <div className="h-4"></div> {/* Espace */}
            
            <Pulse className="w-1/4 h-8" /> {/* Grand titre */}
            <Pulse className="w-full h-4" />
            <Pulse className="w-full h-4" />
            <Pulse className="w-4/5 h-4" />
        </div>
    );
}