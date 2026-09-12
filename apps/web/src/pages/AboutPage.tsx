import { PageHero } from '../components/common/PageHero';
import { AboutSection } from '../components/sections/AboutSection';
import { StatsSection } from '../components/sections/StatsSection';
import { VisionSection } from '../components/sections/VisionSection'; 
import { MissionSection } from '../components/sections/MissionSection'; 
import { FAQSection } from '../components/sections/FAQSection'; 
import { ExecutiveSection } from '../components/sections/ExecutiveSection';
import { ValuesMarquee } from '../components/sections/ValuesMarquee';
import { PartnersSection } from '../components/sections/PartnersSection';

export function AboutPage() {
    return (
        <>
            {/* 1. Hero Section spécifique à la page */}
            <PageHero
                title="Notre Histoire"
                highlight="& Notre Vision"
                description="Découvrez l'histoire, les valeurs et l'équipe qui fait la force de Panda Holding Capital, acteur majeur du développement en RDC."
                breadcrumbs={[
                    { label: "Accueil", path: "/" },
                    { label: "À propos" }
                ]}
            />

            <AboutSection className="bg-gray-100/70 dark:bg-black/10" />
            <StatsSection />
            <VisionSection />
            <MissionSection />
            <FAQSection />
            <ExecutiveSection />
            <ValuesMarquee />
            <PartnersSection />
        </>
    );
}