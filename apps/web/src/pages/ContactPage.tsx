import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { PageHero } from '../components/common/PageHero';
import { MapPin, Phone, Mail, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { messageService } from '../services/messageService';
import { SEO } from '../components/common/SEO';

// ==========================================
// TYPES
// ==========================================
interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const initialFormData: FormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
};

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export function ContactPage() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await messageService.sendMessage(formData);
            setIsSuccess(true);
            setFormData(initialFormData);
            
            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);
        } catch (err) {
            console.error("Erreur envoi message:", err);
            setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement par email.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO 
                title="Contactez-nous | Panda Holding Kinshasa"
                description="Prenez contact avec l'équipe de Panda Holding à Kinshasa. Téléphone, e-mail et formulaire pour vos projets d'investissement et de partenariat en RDC."
                path="/contact"
            />

            <PageHero
                title="Contact"
                highlight="& Échangeons"
                description="Une question, une opportunité d'investissement ou un partenariat ? Notre équipe est à votre écoute pour construire l'avenir avec vous."
                breadcrumbs={[
                    { label: "Accueil", path: "/" },
                    { label: "Contact" }
                ]}
            />

            <section className="py-24 lg:py-32 bg-gray-100/70 dark:bg-black/10 relative overflow-hidden">
                
                {/* Lueurs décoratives */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* EN-TÊTE GLOBAL */}
                    <div className="max-w-4xl mb-12 lg:mb-16 space-y-4 animate-fadeInUp">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-secondary/10 rounded-full border border-primary/10 dark:border-secondary/20">
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider">
                                MESSAGE
                            </span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white leading-tight">
                            Envoyez-nous un{' '}
                            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                message
                            </span>
                        </h2>
                    </div>

                    {/* GRILLE 50/50 */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                        
                        {/* COLONNE GAUCHE : INFOS DE CONTACT (MISE À JOUR & CLIQUABLE) */}
                        <div className="flex items-center justify-center animate-fadeInUp">
                            <div className="bg-primary rounded-3xl flex flex-col items-center justify-center p-8 lg:p-10 text-white relative overflow-hidden w-full h-full border border-gray-200/50 dark:border-white/5">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                                <div className="relative z-10 w-full space-y-8">
                                    <div className="space-y-3">
                                        <h3 className="text-2xl lg:text-3xl font-bold leading-tight">
                                            Parlons de votre <span className="text-accent">projet</span>
                                        </h3>
                                        <p className="text-white/70 text-base leading-relaxed">
                                            Nous sommes impatients de découvrir vos idées et de voir comment nous pouvons collaborer pour un impact durable.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white text-sm mb-0.5">Notre siège</h4>
                                                <p className="text-white/70 text-sm">Kinshasa, RDC</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white text-sm mb-0.5">Téléphone</h4>
                                                {/* Lien cliquable pour appel direct sur mobile */}
                                                <a 
                                                    href="tel:+243897702531" 
                                                    className="text-white/70 text-sm hover:text-accent transition-colors duration-300"
                                                >
                                                    +243 897 702 531
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-4 h-4 text-accent" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white text-sm mb-0.5">Email</h4>
                                                {/* Lien cliquable pour ouvrir le client mail */}
                                                <a 
                                                    href="mailto:arthurmeshearji@gmail.com" 
                                                    className="text-white/70 text-sm hover:text-accent transition-colors duration-300 break-all"
                                                >
                                                    arthurmeshearji@gmail.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLONNE DROITE : FORMULAIRE */}
                        <div className="animate-fadeInUp delay-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-primary dark:text-white block mb-2">
                                            Nom complet
                                        </label>
                                        <input 
                                            type="text" 
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting || isSuccess}
                                            placeholder="Votre nom"
                                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-primary dark:text-white placeholder-gray-400 focus:border-gray-400 dark:focus:border-white/30 transition-all duration-300 outline-none disabled:opacity-60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-primary dark:text-white block mb-2">
                                            Adresse mail
                                        </label>
                                        <input 
                                            type="email" 
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting || isSuccess}
                                            placeholder="votre@email.com"
                                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-primary dark:text-white placeholder-gray-400 focus:border-gray-400 dark:focus:border-white/30 transition-all duration-300 outline-none disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-primary dark:text-white block mb-2">
                                        Titre du message
                                    </label>
                                    <input 
                                        type="text" 
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting || isSuccess}
                                        placeholder="Objet de votre demande"
                                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-primary dark:text-white placeholder-gray-400 focus:border-gray-400 dark:focus:border-white/30 transition-all duration-300 outline-none disabled:opacity-60"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-primary dark:text-white block mb-2">
                                        Message
                                    </label>
                                    <textarea 
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting || isSuccess}
                                        placeholder="Décrivez votre projet ou votre demande..."
                                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-primary dark:text-white placeholder-gray-400 focus:border-gray-400 dark:focus:border-white/30 transition-all duration-300 outline-none resize-none disabled:opacity-60"
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {isSuccess && (
                                    <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
                                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>Message envoyé avec succès ! Nous vous répondrons rapidement.</span>
                                    </div>
                                )}

                                <Button 
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting || isSuccess}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            Envoyer le message
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}