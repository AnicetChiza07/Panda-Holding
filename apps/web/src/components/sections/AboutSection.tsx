import { Award, Target, Shield, TrendingUp } from 'lucide-react';
import { SafeImage } from '../common/SafeImage'; // ✅ Import du composant SafeImage

// 1. Définition des props pour accepter une className personnalisée
interface AboutSectionProps {
    className?: string;
}

const features = [
    {
        icon: Award,
        title: "Partenaire de Confiance",
        description: "Un accompagnement fiable pour vos projets stratégiques.",
        bg: "bg-accent/20",
        color: "text-primary dark:text-accent"
    },
    {
        icon: Target,
        title: "Solutions Innovantes",
        description: "Des solutions agiles adaptées au marché congolais.",
        bg: "bg-secondary/10",
        color: "text-secondary dark:text-secondary-light"
    },
    {
        icon: Shield,
        title: "Fiabilité Éprouvée",
        description: "12+ ans d'expertise dans des projets durables.",
        bg: "bg-primary/10 dark:bg-white/10",
        color: "text-primary dark:text-white"
    },
    {
        icon: TrendingUp,
        title: "Croissance Durable",
        description: "Investir pour l'avenir économique de la RDC.",
        bg: "bg-green-500/10",
        color: "text-green-600 dark:text-green-400"
    }
];

// 2. La fonction reçoit maintenant la prop 'className'
export function AboutSection({ className }: AboutSectionProps) {
    return (
        // 3. Si une className est passée, on l'utilise. Sinon, on utilise le fond par défaut
        <section className={`py-20 lg:py-24 relative overflow-hidden ${className || ' dark:bg-gray-900/0'}`}>
            
            {/* Éléments décoratifs de fond */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* TITRE - EN HAUT, ALIGNÉ À GAUCHE */}
                <div className="max-w-4xl mb-16 space-y-4 animate-fadeInUp">
                    {/* Label */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                            À Propos de Nous
                        </span>
                    </div>
                    
                    {/* Titre principal */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-white leading-tight">
                        Développer l'Excellence <br />
                        <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            en RDC
                        </span>
                    </h2>
                    
                    {/* Ligne décorative */}
                    <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent rounded-full"></div>
                </div>
                
                {/* GRILLE : IMAGE À GAUCHE | TEXTE + FEATURES À DROITE */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* COLONNE GAUCHE : IMAGES */}
                    <div className="relative animate-fadeInUp delay-200">
                        {/* Image principale */}
                        <div className="relative w-full max-w-md">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                {/* ✅ REMPLACÉ PAR SAFEIMAGE */}
                                <SafeImage 
                                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" 
                                    alt="Panda Holding"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        
                        {/* Image secondaire - CACHÉE SUR MOBILE, VISIBLE SUR GRAND ÉCRAN */}
                        <div className="hidden lg:block absolute top-1/2 -right-4 w-56 -translate-y-1/2 animate-fadeInUp delay-300">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-primary relative z-10">
                                {/* ✅ REMPLACÉ PAR SAFEIMAGE */}
                                <SafeImage 
                                    src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800" 
                                    alt="Bureau"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* COLONNE DROITE : PARAGRAPHE + FEATURES */}
                    <div className="space-y-6 animate-fadeInUp delay-300">
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed lg:max-w-lg">
                            Panda Holding Capital est une entreprise congolaise dédiée au développement de projets innovants dans plusieurs secteurs stratégiques. Notre mission : accompagner les entrepreneurs, les entreprises et les communautés vers un avenir prospère et durable.
                        </p>
                        
                        {/* Features en grille 2x2 */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div 
                                        key={feature.title} 
                                        className={`group p-5 rounded-xl ${feature.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                                    >
                                        <div className={`w-11 h-11 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                                            <Icon className="w-6 h-6" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-sm font-bold text-primary dark:text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}