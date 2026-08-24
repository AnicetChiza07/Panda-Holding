import pandaLogo from '../../assets/logo/panda-logo.png';

interface LogoProps {
    className?: string;
}

export function Logo({ className = "h-12 w-auto" }: LogoProps) {
    return (
        <div className="relative group">
            <img 
                src={pandaLogo} 
                alt="Panda Holding Capital" 
                className={`${className} transition-all duration-300 will-change-transform group-hover:scale-105`}
            />
        </div>
    );
}