type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    isLoading?: boolean;
}

export function Button({ 
    variant = 'primary', 
    size = 'md', 
    children, 
    isLoading = false,
    className = '',
    disabled,
    ...props 
}: ButtonProps) {
    
    // Styles de base - ✅ PADDING AMÉLIORÉ
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Styles selon la variante - ✅ COULEURS ADOUCIES POUR LIGHT MODE
    const variantStyles = {
        primary: 'bg-accent text-primary hover:bg-accent/90 hover:scale-[1.02]',
        secondary: 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02]',
        outline: 'border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white',
        ghost: 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
    };
    
    // Styles selon la taille - ✅ PADDING CORRIGÉ
    const sizeStyles = {
        sm: 'px-5 py-2.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-3 text-base'
    };
    
    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    
    return (
        <button 
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}