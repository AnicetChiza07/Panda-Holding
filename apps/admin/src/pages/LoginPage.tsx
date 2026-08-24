import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
    email: z.string()
        .min(1, 'Veuillez remplir tous les champs')
        .email('Adresse email invalide'),
    password: z.string()
        .min(1, 'Veuillez remplir tous les champs')
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const cleanEmail = data.email.trim().toLowerCase();
            const cleanPassword = data.password.trim();

            const response = await authService.login({
                email: cleanEmail,
                password: cleanPassword
            });

            if (response.success && response.token && response.user) {
                login(response.token, response.user);
                toast.success('Connexion réussie !');
                navigate('/', { replace: true });
            } else {
                throw new Error(response.message || 'Erreur inconnue');
            }
        } catch (error: unknown) {
            let msg = 'Email ou mot de passe incorrect.';

            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                msg = err.response?.data?.message || msg;
            } else if (error instanceof Error) {
                msg = error.message;
            }

            console.error("Erreur de connexion:", error);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Déclenché quand la validation du formulaire échoue (champs vides, format invalide, etc.)
    const onValidationError = (formErrors: Record<string, { message?: string }>) => {
        const firstError = Object.values(formErrors)[0];
        if (firstError?.message) {
            toast.error(firstError.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#023047] rounded-xl mb-4 shadow-lg">
                        <span className="text-white font-display font-bold text-2xl">PH</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[#023047] mb-2">
                        Espace Admin
                    </h1>
                    <p className="text-gray-600 font-body">
                        Connectez-vous pour gérer votre site
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit, onValidationError)} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('email', { value: '' })}
                                id="email"
                                type="email"
                                autoComplete="off"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all font-body text-sm"
                                placeholder="admin@pandaholding.cd"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register('password', { value: '' })}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all font-body text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-body"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Connexion en cours...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500 font-body">
                        Ce site est propulsé par Panda Holding
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;