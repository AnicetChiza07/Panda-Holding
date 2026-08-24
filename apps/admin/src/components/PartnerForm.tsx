import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Partner } from '../types/partner';
import { partnerSchema, type PartnerFormData } from '../types/partner';
import ImageUploader from './ImageUploader';

interface PartnerFormProps {
    partner?: Partner | null;
    onSubmit: (data: PartnerFormData) => Promise<void>;
    onCancel: () => void;
}

const PartnerForm = ({ partner, onSubmit, onCancel }: PartnerFormProps) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PartnerFormData>({
        resolver: zodResolver(partnerSchema),
        defaultValues: partner
            ? { name: partner.name, logo: partner.logo, isActive: partner.isActive }
            : { name: '', logo: '', isActive: true },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6 items-center">
                
                {/* COLONNE GAUCHE : Nom + Statut */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Nom du partenaire <span className="text-red-500">*</span>
                        </label>
                        <input 
                            {...register('name')} 
                            type="text" 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                            placeholder="Ex: Banque XYZ" 
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Statut</p>
                                <p className="text-xs text-gray-500 mt-0.5">Visible sur le site</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input {...register('isActive')} type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#023047]"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* COLONNE DROITE : Logo (hauteur réduite) */}
                <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Logo <span className="text-red-500">*</span>
                    </label>
                    {/* ✅ Hauteur réduite : aspect-[16/9] au lieu de aspect-[4/3] */}
                    <div className="w-full aspect-[16/9]">
                        <ImageUploader 
                            value={watch('logo') || ''} 
                            onChange={(url) => setValue('logo', url)} 
                        />
                    </div>
                    {errors.logo && <p className="mt-2 text-xs text-red-600">{errors.logo.message}</p>}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Annuler
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-[#023047] hover:bg-[#011f2e] rounded-lg transition-all shadow-md">
                    {partner ? 'Mettre à jour' : 'Ajouter le partenaire'}
                </button>
            </div>
        </form>
    );
};

export default PartnerForm;