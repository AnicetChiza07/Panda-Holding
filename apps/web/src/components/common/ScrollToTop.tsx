import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Remonte la page tout en haut à chaque changement d'URL
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}