import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CarouselSlide } from '../types/carousel';
import { carouselSlideSchema, type CarouselSlideFormData } from '../types/carousel';
import ImageUploader from './ImageUploader';

interface CarouselFormProps {
    slide?: CarouselSlide | null;
    onSubmit: (data: CarouselSlideFormData) => Promise<void>;
    onCancel: () => void;
}

const CarouselForm = ({ slide, onSubmit, onCancel }: CarouselFormProps) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CarouselSlideFormData>({
        resolver: zodResolver(carouselSlideSchema),
        defaultValues: slide
            ? {
                image: slide.image,
                title: slide.title || '',
                description: slide.description || '',
                order: slide.order,
                isActive: slide.isActive,
            }
            : {
                image: '',
                title: '',
                description: '',
                order: 0,
                isActive: true,
            },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6 items-center">
                
                {/* COLONNE GAUCHE : Titre + Description + Ordre + Statut */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Titre <span className="text-xs text-gray-400">(optionnel)</span>
                        </label>
                        <input 
                            {...register('title')} 
                            type="text" 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                            placeholder="Ex: Bienvenue chez Panda Holding" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Description <span className="text-xs text-gray-400">(optionnel)</span>
                        </label>
                        <textarea 
                            {...register('description')} 
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                            placeholder="Texte affiché sur la bannière..." 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ordre d'affichage
                        </label>
                        <input 
                            {...register('order', { valueAsNumber: true })} 
                            type="number" 
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                            placeholder="0" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Les numéros les plus bas s'affichent en premier</p>
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

                {/* COLONNE DROITE : Image (compacte et centrée) */}
                <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Image de la slide <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full aspect-[16/9]">
                        <ImageUploader 
                            value={watch('image') || ''} 
                            onChange={(url) => setValue('image', url)} 
                        />
                    </div>
                    {errors.image && <p className="mt-2 text-xs text-red-600">{errors.image.message}</p>}
                </div>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-[#023047] hover:bg-[#011f2e] rounded-lg transition-all shadow-md"
                >
                    {slide ? 'Mettre à jour' : 'Créer la slide'}
                </button>
            </div>
        </form>
    );
};

export default CarouselForm;