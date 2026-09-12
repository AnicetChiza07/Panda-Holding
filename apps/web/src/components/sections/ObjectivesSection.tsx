import { TrendingUp, Users, Rocket, Lightbulb } from 'lucide-react';

const objectives = [
    {
        id: 1,
        number: "01",
        icon: TrendingUp,
        title: "Investir Stratégiquement",
        description: "Orienter nos capitaux vers des secteurs à fort potentiel de croissance en RDC.",
        color: "bg-accent/20 text-primary dark:text-accent"
    },
    {
        id: 2,
        number: "02",
        icon: Users,
        title: "Créer des Emplois",
        description: "Générer des opportunités stables et valorisantes pour les talents locaux.",
        color: "bg-secondary/10 text-secondary dark:text-secondary-light"
    },
    {
        id: 3,
        number: "03",
        icon: Rocket,
        title: "Soutenir l'Entrepreneuriat",
        description: "Accompagner les porteurs de projets par du mentorat et un réseau solide.",
        color: "bg-primary/10 text-primary dark:text-white"
    },
    {
        id: 4,
        number: "04",
        icon: Lightbulb,
        title: "Développer l'Innovation",
        description: "Promouvoir des solutions technologiques pour résoudre les défis locaux.",
        color: "bg-green-500/10 text-green-600 dark:text-green-400"
    }
];

export function ObjectivesSection() {
    return (
        // Fond de section gris clair pour la cohérence
        <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-black/10 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Layout 40/60 (2 colonnes sur 5 pour la gauche, 3 sur 5 pour la droite) */}
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 md:items-center">
                    
                    {/* ==========================================
                        COLONNE GAUCHE (40%) : INTRO
                        ========================================== */}
                    <div className="lg:col-span-2 space-y-6 animate-fadeInUp">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                                NOS OBJECTIFS
                            </span>
                        </div>
                        
                        {/* Titre */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-white leading-tight">
                            Nos objectifs <br />
                            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                stratégiques
                            </span>
                        </h2>
                        
                        {/* Paragraphe */}
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-md">
                            Chez Panda Holding, nous ne nous contentons pas de suivre le marché. Nous le façonnons à travers des actions concrètes et mesurables.
                        </p>

                        {/* Ligne décorative */}
                        <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent rounded-full"></div>
                    </div>
                    
                    {/* ==========================================
                        COLONNE DROITE (60%) : GRILLE 2x2
                        ========================================== */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {objectives.map((obj, index) => {
                            const Icon = obj.icon;
                            return (
                                <div 
                                    key={obj.id}
                                    // Padding augmenté à p-6 pour plus d'espace respiratoire
                                    className={`group flex flex-col p-6 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-accent/40 animate-fadeInUp`}
                                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                                >
                                    {/* PARTIE HAUTE : Icône à gauche, Chiffre à droite */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50 dark:border-white/10">
                                        {/* Icône à gauche */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${obj.color}`}>
                                            <Icon className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                        
                                        {/* Chiffre à droite */}
                                        <h5 className="text-xl font-medium text-gray-400 dark:text-white/20 group-hover:text-accent/60 transition-colors duration-300">
                                            {obj.number}
                                        </h5>
                                    </div>
                                    
                                    {/* PARTIE BASSE : Contenu prenant TOUTE la largeur */}
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-primary dark:text-white mb-2 group-hover:text-secondary dark:group-hover:text-secondary-light transition-colors duration-300">
                                            {obj.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {obj.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}