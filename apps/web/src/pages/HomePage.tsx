import { HeroSection } from '../components/sections/HeroSection';
import { StatsSection } from '../components/sections/StatsSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ObjectivesSection } from '../components/sections/ObjectivesSection';
import { ActivitiesCarousel } from '../components/sections/ActivitiesCarousel';
import { LatestArticles } from '../components/sections/LatestArticles';
import { TestimonialsMarquee } from '../components/sections/TestimonialsMarquee';
import { PartnersSection } from '../components/sections/PartnersSection';

import { SEO } from '../components/common/SEO';

export function HomePage() {
    return (
        <>
            <SEO 
                title="Panda Holding | Leader de l'Investissement et de l'Innovation en RDC"
                description="Découvrez Panda Holding, votre partenaire stratégique à Kinshasa pour le développement, l'investissement et la croissance durable en République Démocratique du Congo."
                path="/"
                image="/panda-logo.png"
            />

            <HeroSection />
            <StatsSection />
            <AboutSection />
            <ObjectivesSection />
            <ActivitiesCarousel />
            <LatestArticles />
            <TestimonialsMarquee />
            <PartnersSection />
        </>
    );
}