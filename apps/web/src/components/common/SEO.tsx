import { Helmet } from 'react-helmet-async';

interface FAQItem {
    question: string;
    answer: string;
}

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    type?: 'website' | 'article';
    faqData?: FAQItem[];
}

export const SEO = ({
    title = "Panda Holding | Investissement et Développement en RDC",
    description = "Panda Holding est une entreprise basée à Kinshasa, RDC, dédiée à l'investissement, l'innovation et le développement stratégique des entreprises africaines.",
    image = "/panda-logo.png",
    path = "",
    type = "website",
    faqData
}: SEOProps) => {
    const siteUrl = "https://panda-holding-web.vercel.app";
    const fullUrl = `${siteUrl}${path}`;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    // 1. Schéma Organization (Toujours présent)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Panda Holding",
        "url": siteUrl,
        "logo": `${siteUrl}/panda-logo.png`,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+243-897-702-531",
            "contactType": "customer service",
            "areaServed": "CD",
            "availableLanguage": ["French"]
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kinshasa",
            "addressCountry": "CD"
        },
        "email": "arthurmeshearji@gmail.com"
    };

    // 2. Schéma FAQPage (Généré uniquement si faqData est fourni)
    const faqSchema = faqData && faqData.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    return (
        <Helmet>
            {/* --- Balises Standards --- */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={fullUrl} />
            <meta name="language" content="French" />

            {/* --- Open Graph (Facebook, LinkedIn, WhatsApp) --- */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:locale" content="fr_CD" />
            <meta property="og:site_name" content="Panda Holding" />

            {/* --- Twitter Card --- */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* --- Structured Data (JSON-LD) --- */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            
            {/* Injection conditionnelle du schéma FAQ */}
            {faqSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            )}
        </Helmet>
    );
};