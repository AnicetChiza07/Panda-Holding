import { HeroSection } from '../components/sections/HeroSection';
import { StatsSection } from '../components/sections/StatsSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ObjectivesSection } from '../components/sections/ObjectivesSection';
import { ActivitiesCarousel } from '../components/sections/ActivitiesCarousel';
import { LatestArticles } from '../components/sections/LatestArticles';
import { PartnersSection } from '../components/sections/PartnersSection';

export function HomePage() {
    return (
        <>
            <HeroSection />
            <StatsSection />
            <AboutSection />
            <ObjectivesSection />
            <ActivitiesCarousel />
            <LatestArticles />
            <PartnersSection />
        </>
    );
}