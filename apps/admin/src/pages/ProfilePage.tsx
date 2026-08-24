import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { 
    User, Lock, LogOut, Calendar, Shield, 
    CheckCircle, AlertCircle, Loader2, Camera, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import type { ProfileFormData, PasswordFormData } from '../types/user';
import { profileSchema, passwordSchema } from '../types/user';
import ImageUploader from '../components/ImageUploader';
import { useAuth } from '../context/AuthContext';

interface AxiosErrorResponse {
    response?: { data?: { message?: string } };
}

type TabType = 'info' | 'photo' | 'security';

const ProfilePage = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Formulaires React Hook Form
    const { register: registerInfo, handleSubmit: handleSubmitInfo, watch: watchInfo, setValue: setValueInfo, formState: { errors: errorsInfo } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const { register: registerPwd, handleSubmit: handleSubmitPwd, formState: { errors: errorsPwd }, reset: resetPwd } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await userService.getMe();
                setValueInfo('name', userData.name);
                setValueInfo('email', userData.email);
                if (userData.avatar) setValueInfo('avatar', userData.avatar);
            } catch (error) {
                console.error("Erreur chargement profil:", error);
                toast.error('Impossible de charger le profil');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [setValueInfo]);

    const onSubmitInfo = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            const updatedUser = await userService.updateProfile(data);
            if (user && updateUser) {
                updateUser({ ...user, ...updatedUser });
            }
            toast.success('Profil mis à jour avec succès');
        } catch (error: unknown) {
            const err = error as AxiosErrorResponse;
            toast.error(err?.response?.data?.message ?? 'Erreur lors de la mise à jour');
        } finally {
            setIsSaving(false);
        }
    };

    const onSubmitPassword = async (data: PasswordFormData) => {
        setIsSaving(true);
        try {
            await userService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success('Mot de passe changé avec succès. Déconnexion...');
            resetPwd();
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (error: unknown) {
            const err = error as AxiosErrorResponse;
            toast.error(err?.response?.data?.message ?? 'Erreur lors du changement de mot de passe');
            setIsSaving(false); // On garde le bouton actif si échec pour réessayer
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'AD';
        const names = name.trim().split(' ');
        if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const tabs = [
        { id: 'info' as TabType, label: 'Informations', desc: 'Nom, email et compte', icon: User },
        { id: 'photo' as TabType, label: 'Photo de profil', desc: 'Personnalise ton avatar', icon: Camera },
        { id: 'security' as TabType, label: 'Sécurité', desc: 'Mot de passe', icon: Lock },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header de la page */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
                <p className="text-gray-600 mt-2">Gère tes informations personnelles et la sécurité du compte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* ========================================== */}
                {/* COLONNE GAUCHE : Carte Profil + Navigation */}
                {/* ========================================== */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Carte Profil */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-[#023047] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {watchInfo('avatar') ? (
                                    <img src={watchInfo('avatar')} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold text-xl">{getInitials(user?.name)}</span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-gray-900 truncate">{user?.name || 'Administrateur'}</h2>
                                <p className="text-sm text-gray-500 truncate">{user?.email || 'admin@panda.com'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-[#46c2c5]/20 text-[#023047] text-xs font-semibold rounded-full flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {user?.role === 'admin' ? 'Administrateur' : 'Éditeur'}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Actif
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Membre depuis {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Menu de navigation */}
                    <nav className="space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                                        activeTab === tab.id
                                            ? 'bg-[#023047] text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm">{tab.label}</p>
                                        <p className={`text-xs ${activeTab === tab.id ? 'text-[#46c2c5]' : 'text-gray-500'}`}>
                                            {tab.desc}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}

                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-red-600 bg-red-50 hover:bg-red-100 mt-4"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm">Déconnexion</p>
                                <p className="text-xs text-red-400">Quitter la session</p>
                            </div>
                        </button>
                    </nav>
                </div>

                {/* ========================================== */}
                {/* COLONNE DROITE : Contenu des Onglets       */}
                {/* ========================================== */}
                <div className="lg:col-span-8">
                    
                    {/* ONGLET 1 : Informations */}
                    {activeTab === 'info' && (
                        <form onSubmit={handleSubmitInfo(onSubmitInfo)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Informations personnelles</h2>
                                <p className="text-gray-600">Mets à jour le nom affiché dans le backoffice et sur le site.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet <span className="text-red-500">*</span></label>
                                    <input
                                        {...registerInfo('name')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all"
                                        placeholder="Ex: Jean Dupont"
                                    />
                                    {errorsInfo.name && <p className="mt-2 text-xs text-red-600">{errorsInfo.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                                    <input
                                        {...registerInfo('email')}
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all"
                                        placeholder="votre@email.com"
                                    />
                                    {errorsInfo.email && <p className="mt-2 text-xs text-red-600">{errorsInfo.email.message}</p>}
                                    <p className="mt-2 text-xs text-gray-500">L'email est utilisé pour la connexion et les notifications.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de compte</label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                                        <Shield className="w-5 h-5 text-[#46c2c5]" />
                                        <span className="font-medium text-gray-900">{user?.role === 'admin' ? 'Administrateur' : 'Éditeur'}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Géré par un administrateur principal.</p>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (user) {
                                                setValueInfo('name', user.name);
                                                setValueInfo('email', user.email);
                                            }
                                        }}
                                        className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#023047] hover:bg-[#011f2e] text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                                    >
                                        {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</> : <><CheckCircle className="w-5 h-5" /> Enregistrer</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* ONGLET 2 : Photo de profil */}
                    {activeTab === 'photo' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Photo de profil</h2>
                                <p className="text-gray-600">Personnalise ton avatar affiché dans le backoffice.</p>
                            </div>

                            <div className="space-y-8">
                                {/* Aperçu actuel */}
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-gray-200">
                                        {watchInfo('avatar') ? (
                                            <img src={watchInfo('avatar')} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 font-bold text-3xl">{getInitials(user?.name)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{watchInfo('avatar') ? 'Photo actuelle' : 'Aucune photo'}</h3>
                                        <p className="text-sm text-gray-500">
                                            {watchInfo('avatar') ? 'Clique sur "Changer" pour mettre à jour ou "Supprimer" pour retirer.' : 'Télécharge une photo pour personnaliser ton profil.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Zone d'upload (Utilise ton composant ImageUploader) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nouvelle photo</label>
                                    <div className="max-w-md">
                                        <ImageUploader 
                                            value={watchInfo('avatar') || ''} 
                                            onChange={(url) => setValueInfo('avatar', url)} 
                                        />
                                    </div>
                                </div>

                                {/* Conseils */}
                                <div className="bg-[#46c2c5]/10 border border-[#46c2c5]/30 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-[#023047] flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-[#023047]">
                                            <p className="font-medium mb-1">Conseils :</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Utilise une image carrée pour un meilleur rendu.</li>
                                                <li>Taille recommandée : 200x200 pixels minimum.</li>
                                                <li>Formats acceptés : PNG, JPG (max 5 Mo).</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setValueInfo('avatar', '')}
                                        disabled={!watchInfo('avatar')}
                                        className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="w-5 h-5" /> Supprimer la photo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmitInfo(onSubmitInfo)}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#023047] hover:bg-[#011f2e] text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                                    >
                                        {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Sauvegarde...</> : <><CheckCircle className="w-5 h-5" /> Enregistrer la photo</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONGLET 3 : Sécurité */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleSubmitPwd(onSubmitPassword)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Changer le mot de passe</h2>
                                <p className="text-gray-600">Assurez-vous d'utiliser un mot de passe fort et sécurisé.</p>
                            </div>

                            <div className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel <span className="text-red-500">*</span></label>
                                    <input
                                        {...registerPwd('currentPassword')}
                                        type="password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all"
                                        placeholder="••••••••"
                                    />
                                    {errorsPwd.currentPassword && <p className="mt-2 text-xs text-red-600">{errorsPwd.currentPassword.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe <span className="text-red-500">*</span></label>
                                    <input
                                        {...registerPwd('newPassword')}
                                        type="password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all"
                                        placeholder="Au moins 6 caractères"
                                    />
                                    {errorsPwd.newPassword && <p className="mt-2 text-xs text-red-600">{errorsPwd.newPassword.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe <span className="text-red-500">*</span></label>
                                    <input
                                        {...registerPwd('confirmPassword')}
                                        type="password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all"
                                        placeholder="••••••••"
                                    />
                                    {errorsPwd.confirmPassword && <p className="mt-2 text-xs text-red-600">{errorsPwd.confirmPassword.message}</p>}
                                </div>

                                <div className="bg-[#F4A100]/10 border border-[#F4A100]/30 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-[#F4A100] flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-gray-800">
                                            <p className="font-medium mb-1">Important :</p>
                                            <p>Après avoir changé votre mot de passe, vous serez automatiquement déconnecté pour des raisons de sécurité.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => resetPwd()}
                                        className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#023047] hover:bg-[#011f2e] text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                                    >
                                        {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Changement...</> : <><Lock className="w-5 h-5" /> Changer le mot de passe</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;