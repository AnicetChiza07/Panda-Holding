import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter la position du scroll
 * @param threshold - Distance en pixels à partir de laquelle on considère que l'utilisateur a scrollé (défaut: 20)
 * @returns boolean - true si la page a été scrollée au-delà du seuil
 */
export function useScrollPosition(threshold = 20) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setScrolled(window.scrollY > threshold);
        };

        // Vérification initiale au cas où la page est chargée en milieu de scroll
        handleScroll();

        // Ajout de l'écouteur avec passive: true pour de meilleures performances
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return scrolled;
}