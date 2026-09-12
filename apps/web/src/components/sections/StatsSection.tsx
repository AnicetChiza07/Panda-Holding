import { Briefcase, Users, Building2, Leaf } from 'lucide-react';

const statsData = [
    {
        id: 1,
        icon: Briefcase,
        value: "5+",
        label: "SECTEURS D'INVESTISSEMENT",
        description: "Immobilier, Tourisme, Innovation et plus.",
        iconBg: "bg-secondary/10 dark:bg-secondary/20",
        iconColor: "text-secondary dark:text-secondary-light"
    },
    {
        id: 2,
        icon: Users,
        value: "8+",
        label: "PARTENAIRES STRATÉGIQUES",
        description: "Un réseau solide d'experts locaux et internationaux.",
        iconBg: "bg-primary/10 dark:bg-white/10",
        iconColor: "text-primary dark:text-white"
    },
    {
        id: 3,
        icon: Leaf,
        value: "100%",
        label: "ENGAGEMENT DURABLE",
        description: "Investir pour l'avenir économique de la RDC.",
        iconBg: "bg-green-500/10 dark:bg-green-500/20",
        iconColor: "text-green-600 dark:text-green-400"
    },
    {
        id: 4,
        icon: Building2,
        value: "7+",
        label: "PROJETS ACCOMPAGNÉS",
        description: "De la conception à la réalisation de projets d'envergure.",
        iconBg: "bg-accent/20 dark:bg-accent/15",
        iconColor: "text-primary dark:text-accent"
    }
];

export function StatsSection() {
    return (
        // Fond subtil en light ET dark pour créer une séparation visuelle professionnelle
        <section className="py-24 bg-gray-100/70 dark:bg-black/10 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Grille responsive : 1 → 2 → 4 colonnes */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={stat.id}
                                className={`group relative p-6 rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-primary/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/40 dark:hover:border-accent/30 animate-fadeInUp delay-${(index + 1) * 100}`}
                            >
                                {/* Partie supérieure : Chiffre (gauche) et Icône (droite) */}
                                <div className="flex items-start justify-between mb-5">
                                    <h3 className="text-4xl font-bold text-primary dark:text-white tracking-tight">
                                        {stat.value}
                                    </h3>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${stat.iconBg}`}>
                                        <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2} />
                                    </div>
                                </div>

                                {/* Label style "badge" */}
                                <div className="mb-3">
                                    <span className="inline-flex items-center px-3 py-1 bg-primary/5 dark:bg-secondary/10 text-primary dark:text-secondary text-[11px] font-bold rounded-full uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>

                                {/* Description courte */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {stat.description}
                                </p>

                                {/* Ligne décorative dorée en bas au survol */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent rounded-full transition-all duration-300 group-hover:w-1/2"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}