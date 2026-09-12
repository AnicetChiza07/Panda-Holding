export function ValuesMarquee() {
    const words = [
        "Panda Holding",
        "Excellence",
        "Innovation",
        "Leadership",
        "Croissance durable",
        "Transformation",
        "Engagement",
        "Prospérité",
        "Vision",
        "Performance",
        "Partenariat"
    ];

    const duplicatedWords = [...words, ...words];

    return (
        <section className="py-16 lg:py-18 bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-9 marquee-fade">
                    
                    {/* ==========================================
                        LIGNE DU HAUT - Défile de droite à gauche
                        ========================================== */}
                    <div className="overflow-hidden">
                        <div className="flex animate-marquee-right whitespace-nowrap">
                            {duplicatedWords.map((word, index) => (
                                <div 
                                    key={`top-${index}`}
                                    className="flex-shrink-0 mx-4"
                                >
                                    <div className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:border-secondary dark:hover:border-secondary/50 hover:bg-secondary/5 dark:hover:bg-secondary/10 transition-all duration-300 cursor-default">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {word}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ==========================================
                        LIGNE DU BAS - Défile de gauche à droite (sens inverse)
                        ========================================== */}
                    <div className="overflow-hidden">
                        <div className="flex animate-marquee-left whitespace-nowrap">
                            {duplicatedWords.map((word, index) => (
                                <div 
                                    key={`bottom-${index}`}
                                    className="flex-shrink-0 mx-4"
                                >
                                    <div className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:border-accent dark:hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-300 cursor-default">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {word}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}