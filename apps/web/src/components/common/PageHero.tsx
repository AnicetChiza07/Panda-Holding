import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Breadcrumb {
    label: string;
    path?: string;
}

interface PageHeroProps {
    title: string;
    highlight?: string;
    description: string;
    breadcrumbs: Breadcrumb[];
}

export function PageHero({
    title,
    highlight,
    description,
    breadcrumbs
}: PageHeroProps) {
    return (
        <section className="relative h-[75vh] min-h-[500px] flex items-center overflow-hidden">
            
            {/* 1. Lueurs décoratives - Adaptées pour Light et Dark mode */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 dark:bg-secondary/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            {/* 2. Motif de fond subtil (points) - Utilise 'currentColor' pour s'adapter automatiquement */}
            <div 
                className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] text-primary dark:text-white"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-fadeInUp">
                    
                    {/* Breadcrumb */}
                    <nav aria-label="Fil d'Ariane" className="flex items-center justify-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={index} className="flex items-center gap-2">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-primary/30 dark:text-white/30" />
                                )}
                                {crumb.path ? (
                                    <Link 
                                        to={crumb.path}
                                        className="flex items-center gap-1.5 text-primary/70 dark:text-white/60 hover:text-accent transition-colors duration-300"
                                    >
                                        {index === 0 && <Home className="w-3.5 h-3.5" />}
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="font-semibold text-accent">
                                        {crumb.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>

                    {/* Titre - text-primary en light, text-white en dark */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-primary dark:text-white">
                        {title}
                        {highlight && (
                            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                {' '}{highlight}
                            </span>
                        )}
                    </h1>

                    {/* Description - text-primary/80 en light, text-white/70 en dark */}
                    <p className="text-base lg:text-lg leading-relaxed max-w-2xl mx-auto text-primary/80 dark:text-white/70">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}