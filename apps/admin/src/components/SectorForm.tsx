import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import type { JSONContent } from '@tiptap/react';
import type { Sector } from '../types/sector';
import { sectorSchema, type SectorFormData } from '../types/sector';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

interface SectorFormProps {
    sector?: Sector | null;
    categories: string[];
    onSubmit: (data: SectorFormData) => Promise<void>;
    onCancel: () => void;
}

const generateSlug = (text: string) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const normalizeLongDescription = (ld: JSONContent | JSONContent[] | null | undefined): JSONContent => {
    if (!ld) return { type: 'doc', content: [] };
    if (typeof ld === 'object' && 'type' in ld && ld.type === 'doc' && Array.isArray((ld as JSONContent).content)) return ld as JSONContent;
    if (Array.isArray(ld)) return { type: 'doc', content: ld };
    return { type: 'doc', content: [] };
};

const SectorForm = ({ sector, categories, onSubmit, onCancel }: SectorFormProps) => {
    const [newExpertise, setNewExpertise] = useState('');

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SectorFormData>({
        resolver: zodResolver(sectorSchema),
        defaultValues: sector
            ? {
                name: sector.name, slug: sector.slug, shortDescription: sector.shortDescription,
                category: sector.category || '', isActive: sector.isActive,
                coverImage: sector.coverImage || sector.image || '',
                images: sector.images?.length ? sector.images : ['', '', '', ''],
                expertises: sector.expertises || [],
                longDescription: normalizeLongDescription(sector.longDescription),
            }
            : {
                name: '', slug: '', shortDescription: '', category: '', isActive: true,
                coverImage: '', images: ['', '', '', ''], expertises: [],
                longDescription: { type: 'doc', content: [] },
            },
    });

    const watchedName = watch('name');
    useEffect(() => {
        if (watchedName && !sector) setValue('slug', generateSlug(watchedName));
    }, [watchedName, setValue, sector]);

    const handleAddExpertise = () => {
        if (newExpertise.trim()) {
            setValue('expertises', [...(watch('expertises') || []), newExpertise.trim()]);
            setNewExpertise('');
        }
    };

    const handleRemoveExpertise = (index: number) => {
        setValue('expertises', (watch('expertises') || []).filter((_, i) => i !== index));
    };

    const handleImageChange = (index: number, url: string) => {
        const current = watch('images') || ['', '', '', ''];
        const updated = [...current];
        updated[index] = url;
        setValue('images', updated);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du secteur *</label>
                    <input {...register('name')} type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" placeholder="Ex: Immobilier" />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL) *</label>
                    <input {...register('slug')} type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" placeholder="Ex: immobilier" />
                    {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie *</label>
                    <select {...register('category')} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]">
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
                </div>
                <div className="pb-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register('isActive')} type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#46c2c5]"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Secteur actif</span>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-[#023047] uppercase tracking-wide mb-4 flex items-center gap-2">Aperçu et Couverture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description courte *</label>
                        <textarea {...register('shortDescription')} rows={5} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" placeholder="Brève description pour les cartes et aperçus" />
                        {errors.shortDescription && <p className="mt-1 text-xs text-red-600">{errors.shortDescription.message}</p>}
                    </div>
                    <div>
                        <div className="aspect-[4/3]">
                            <ImageUploader
                                label="Image de couverture *"
                                value={watch('coverImage') || ''}
                                onChange={(url) => setValue('coverImage', url)}
                            />
                        </div>
                        {errors.coverImage && <p className="mt-2 text-xs text-red-600">{errors.coverImage.message}</p>}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-[#023047] uppercase tracking-wide mb-4 flex items-center gap-2">Description détaillée</h3>
                <RichTextEditor 
                    content={watch('longDescription')} 
                    onChange={(content) => setValue('longDescription', content)} 
                    placeholder="Rédigez la description complète du secteur..."
                />
            </div>

            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-[#023047] uppercase tracking-wide mb-4 flex items-center gap-2">Domaines d'expertise</h3>
                <div className="flex gap-2 mb-3">
                    <input 
                        type="text" 
                        value={newExpertise} 
                        onChange={(e) => setNewExpertise(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                        placeholder="Ajouter une expertise..." 
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                    />
                    <button type="button" onClick={handleAddExpertise} className="px-4 py-2 bg-[#023047] hover:bg-[#011f2e] text-white rounded-lg text-sm font-medium transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {watch('expertises')?.map((exp, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-[#023047] rounded-lg text-xs font-medium border border-gray-200 shadow-sm">
                            {exp}
                            <button type="button" onClick={() => handleRemoveExpertise(index)} className="hover:text-red-600 ml-1"><X size={12} /></button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-[#023047] uppercase tracking-wide mb-4 flex items-center gap-2">Galerie d'images</h3>
                <p className="text-xs text-gray-500 mb-3 -mt-1">Images supplémentaires pour illustrer le secteur.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="aspect-[3/4]">
                            <ImageUploader
                                label={`Image ${index + 1}`}
                                value={watch('images')?.[index] || ''}
                                onChange={(url) => handleImageChange(index, url)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Annuler
                </button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#023047] hover:bg-[#011f2e] rounded-lg transition-all shadow-md">
                    {sector ? 'Mettre à jour' : 'Créer le secteur'}
                </button>
            </div>
        </form>
    );
};

export default SectorForm;