import { Briefcase, Settings, Handshake } from 'lucide-react';
import { SafeImage } from '../common/SafeImage'; // ✅ Import ajouté

const steps = [
    {
        number: "01",
        icon: Briefcase,
        title: "Concevoir",
        description: "Nous analysons les besoins et concevons des solutions sur mesure, alignées avec les réalités locales.",
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        number: "02",
        icon: Settings,
        title: "Développer",
        description: "Nous mobilisons les ressources et expertises pour transformer les idées en projets concrets.",
        color: "text-amber-600 dark:text-accent",
        bg: "bg-amber-500/15 dark:bg-accent/10"
    },
    {
        number: "03",
        icon: Handshake,
        title: "Accompagner",
        description: "Nous suivons chaque projet pour maximiser son impact économique et social.",
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-500/10"
    }
];

export function MissionSection() {
    return (
        <section className="py-24 lg:py-32 bg-gray-50/40 dark:bg-gray-900/40 relative overflow-hidden">
            
            {/* Lueurs décoratives */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* EN-TÊTE DE SECTION */}
                <div className="max-w-4xl mb-16 space-y-4 animate-fadeInUp">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                            NOTRE MISSION
                        </span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white leading-tight">
                        <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            Concevoir
                        </span>
                        ,{' '}
                        <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                            développer
                        </span>
                        {' '}et{' '}
                        <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            accompagner
                        </span>
                        {' '}des projets à fort impact économique et social.
                    </h2>
                    
                    <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent rounded-full"></div>
                </div>

                {/* LAYOUT 50/50 */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* COLONNE GAUCHE : CARTES EN DISPOSITION 2+1 */}
                    <div className="space-y-4 animate-fadeInUp delay-200">
                        
                        {/* CARTES DU HAUT - 2 CARTES CÔTE À CÔTE */}
                        <div className="grid grid-cols-2 gap-4">
                            {steps.slice(0, 2).map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div 
                                        key={step.number}
                                        className={`group relative p-4 rounded-2xl ${step.bg} border border-transparent hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                                        style={{ animationDelay: `${(index + 1) * 150}ms` }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-bold text-amber-600/60 dark:text-accent/50 leading-none">
                                                {step.number}
                                            </h4>
                                            <div className="w-9 h-9 rounded-lg bg-white/50 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Icon className={`w-4 h-4 ${step.color}`} strokeWidth={2} />
                                            </div>
                                        </div>
                                        <div className="w-full h-px bg-gradient-to-r from-amber-500/40 via-amber-500/60 to-amber-500/40 dark:from-accent/30 dark:via-accent/50 dark:to-accent/30 mb-2"></div>
                                        <h3 className="text-base font-bold text-primary dark:text-white mb-1">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CARTE DU BAS - PLEINE LARGEUR */}
                        <div 
                            className={`group relative p-4 rounded-2xl ${steps[2].bg} border border-transparent hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                            style={{ animationDelay: `450ms` }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xl font-bold text-amber-600/60 dark:text-accent/50 leading-none">
                                    {steps[2].number}
                                </h4>
                                <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {(() => {
                                        const Icon = steps[2].icon;
                                        return <Icon className={`w-5 h-5 ${steps[2].color}`} strokeWidth={2} />;
                                    })()}
                                </div>
                            </div>
                            <div className="w-full h-px bg-gradient-to-r from-amber-500/40 via-amber-500/60 to-amber-500/40 dark:from-accent/30 dark:via-accent/50 dark:to-accent/30 mb-2"></div>
                            <h3 className="text-lg font-bold text-primary dark:text-white mb-2">
                                {steps[2].title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {steps[2].description}
                            </p>
                        </div>
                    </div>

                    {/* COLONNE DROITE : IMAGE + CARTE FLOTTANTE */}
                    <div className="relative animate-fadeInUp delay-300">
                        <div className="relative w-full max-w-md mx-auto">
                            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                {/* ✅ REMPLACÉ PAR SAFEIMAGE */}
                                <SafeImage 
                                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800" 
                                    alt="Équipe Panda Holding en action"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Carte flottante */}
                        <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white dark:bg-primary rounded-xl shadow-xl border border-gray-200 dark:border-white/10 p-3 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg bg-amber-500/15 dark:bg-accent/10 flex items-center justify-center">
                                    <span className="text-sm text-amber-600 dark:text-accent">45+</span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-primary dark:text-white">
                                        Projets
                                    </p>
                                    <p className="text-[10px] text-gray-600 dark:text-gray-400">
                                        accompagnés
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}