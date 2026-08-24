import { useState } from 'react';

// ✅ CORRECTION : On importe l'image comme un module
import pandaLogoFallback from '../../assets/logo/panda-logo.png';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export function SafeImage({ src, alt, fallbackSrc = pandaLogoFallback, ...props }: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = () => {
        // Si l'image principale échoue, on bascule sur le logo de secours
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            {...props}
            src={imgSrc}
            alt={alt}
            onError={handleError}
        />
    );
}