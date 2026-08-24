import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSONContent } from '@tiptap/react';
import type { Project } from '../types/project';
import { projectSchema, type ProjectFormData } from '../types/project';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

// ✅ Interface corrigée avec les VRAIS types de Project
interface ProjectFormProps {
    project?: Project | null;
    categories: string[];
    onSubmit: (data: ProjectFormData) => Promise<void>;
    onCancel: () => void;
}

const generateSlug = (text: string) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const normalizeContent = (content: JSONContent | JSONContent[] | null | undefined): JSONContent => {
    if (!content) return { type: 'doc', content: [] };
    if (typeof content === 'object' && 'type' in content && content.type === 'doc' && Array.isArray((content as JSONContent).content)) return content as JSONContent;
    if (Array.isArray(content)) return { type: 'doc', content };
    return { type: 'doc', content: [] };
};

const ProjectForm = ({ project, categories, onSubmit, onCancel }: ProjectFormProps) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: project
            ? {
                title: project.title, slug: project.slug, category: project.category,
                location: project.location, shortDescription: project.shortDescription,
                longDescription: normalizeContent(project.longDescription),
                image: project.image, gallery: project.gallery?.length ? project.gallery : ['', '', '', ''],
                isActive: project.isActive,
            }
            : {
                title: '', slug: '', category: '', location: '', shortDescription: '',
                longDescription: { type: 'doc', content: [] },
                image: '', gallery: ['', '', '', ''], isActive: true,
            },
    });

    const watchedTitle = watch('title');
    useEffect(() => {
        if (watchedTitle && !project) setValue('slug', generateSlug(watchedTitle));
    }, [watchedTitle, setValue, project]);

    const handleImageChange = (index: number, url: string) => {
        const current = watch('gallery') || ['', '', '', ''];
        const updated = [...current];
        updated[index] = url;
        setValue('gallery', updated);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Colonne principale (8/12) */}
                <div className="lg:col-span-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre du projet <span className="text-red-500">*</span></label>
                        <input {...register('title')} type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" placeholder="Ex: Résidence Les Palmiers" />
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL) <span className="text-red-500">*</span></label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">panda-holding.com/projets/</span>
                            <input {...register('slug')} type="text" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" placeholder="residence-les-palmiers" />
                        </div>
                        {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Lieu <span className="text-red-500">*</span></label>
                        <input {...register('location')} type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" placeholder="Ex: Abidjan, Cocody" />
                        {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description courte <span className="text-red-500">*</span></label>
                        <textarea {...register('shortDescription')} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" placeholder="En 1-2 phrases, en quoi consiste ce projet ?" />
                        {errors.shortDescription && <p className="mt-1 text-xs text-red-600">{errors.shortDescription.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description détaillée</label>
                        <RichTextEditor content={watch('longDescription')} onChange={(content) => setValue('longDescription', content)} placeholder="Détails du projet, matériaux, superficie, etc." />
                    </div>
                </div>

                {/* Sidebar (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Paramètres</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie <span className="text-red-500">*</span></label>
                                <select {...register('category')} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]">
                                    <option value="">Sélectionner</option>
                                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <label className="flex items-center cursor-pointer">
                                    <input {...register('isActive')} type="checkbox" className="w-4 h-4 text-[#023047] border-gray-300 rounded focus:ring-2 focus:ring-[#023047]/20" />
                                    <span className="ml-2 text-sm text-gray-700">Projet actif (visible)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Image de couverture</h3>
                        <div className="aspect-[4/3]">
                            <ImageUploader value={watch('image') || ''} onChange={(url) => setValue('image', url)} />
                        </div>
                        {errors.image && <p className="mt-2 text-xs text-red-600">{errors.image.message}</p>}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Galerie (Max 4)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index} className="aspect-[3/4]">
                                    <ImageUploader value={watch('gallery')?.[index] || ''} onChange={(url) => handleImageChange(index, url)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div className="lg:col-span-12 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Annuler</button>
                    <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-[#023047] hover:bg-[#011f2e] rounded-lg transition-all shadow-md">
                        {project ? 'Mettre à jour' : 'Créer le projet'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProjectForm;