import { Briefcase, Lightbulb, Leaf } from 'lucide-react';

const pillars = [
    {
        icon: Briefcase,
        title: "Investissement",
        description: "Nous identifions et finançons les opportunités à fort potentiel pour générer une croissance durable et des retours exceptionnels.",
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "Nous repoussons les limites en intégrant les technologies de pointe et les solutions créatives dans tous nos projets.",
        color: "text-amber-600 dark:text-accent",
        bg: "bg-amber-500/15 dark:bg-accent/10"
    },
    {
        icon: Leaf,
        title: "Développement Durable",
        description: "Nous plaçons l'impact social et environnemental au cœur de chaque décision pour construire un avenir prospère et responsable.",
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-500/10"
    }
];

export function VisionSection() {
    return (
        <section className="py-24 lg:py-32 bg-white dark:bg-primary relative overflow-hidden">
            
            {/* Lueurs décoratives pour la profondeur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* DÉCLARATION DE VISION - EN HAUT */}
                <div className="max-w-4xl mx-auto text-center space-y-6 mb-20 animate-fadeInUp">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                            NOTRE VISION
                        </span>
                    </div>
                    
                    {/* Déclaration de vision - TAILLE RÉDUITE */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white leading-tight">
                        Devenir un groupe de référence en Afrique dans{' '}
                        <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            l'investissement
                        </span>
                        ,{' '}
                        <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                            l'innovation
                        </span>
                        {' '}et le{' '}
                        <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            développement durable
                        </span>
                        .
                    </h2>
                    
                    {/* Ligne décorative */}
                    <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent rounded-full mx-auto"></div>
                </div>

                {/* LES 3 PILIERS - EN DESSOUS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {pillars.map((pillar, index) => {
                        const Icon = pillar.icon;
                        return (
                            <div 
                                key={pillar.title}
                                className="group relative p-8 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent/40 animate-fadeInUp"
                                style={{ animationDelay: `${(index + 1) * 150}ms` }}
                            >
                                {/* Icône - TAILLE RÉDUITE */}
                                <div className={`w-12 h-12 rounded-xl ${pillar.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-6 h-6 ${pillar.color}`} strokeWidth={1.5} />
                                </div>
                                
                                {/* Titre */}
                                <h3 className="text-xl font-bold text-primary dark:text-white mb-4 group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors duration-300">
                                    {pillar.title}
                                </h3>
                                
                                {/* Description */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {pillar.description}
                                </p>
                                
                                {/* Ligne décorative en bas au hover */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-secondary to-accent rounded-full group-hover:w-16 transition-all duration-300"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}