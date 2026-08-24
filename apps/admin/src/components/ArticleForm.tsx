import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSONContent } from '@tiptap/react';
import type { Article } from '../types/article';
import { articleSchema, type ArticleFormData } from '../types/article';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

interface ArticleFormProps {
    article?: Article | null;
    categories: string[];
    onSubmit: (data: ArticleFormData) => Promise<void>;
    onCancel: () => void;
}

const generateSlug = (text: string) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const normalizeContent = (content: JSONContent | JSONContent[] | null | undefined): JSONContent => {
    if (!content) return { type: 'doc', content: [] };
    if (typeof content === 'object' && 'type' in content && content.type === 'doc' && Array.isArray((content as JSONContent).content)) {
        return content as JSONContent;
    }
    if (Array.isArray(content)) {
        return { type: 'doc', content: content };
    }
    return { type: 'doc', content: [] };
};

const ArticleForm = ({ article, categories, onSubmit, onCancel }: ArticleFormProps) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: article
            ? {
                title: article.title,
                slug: article.slug,
                category: article.category,
                excerpt: article.excerpt,
                content: normalizeContent(article.content),
                image: article.image,
                gallery: [],
                tags: [],
                author: article.author,
                authorInitials: article.authorInitials,
                date: article.date,
                readTime: article.readTime,
                isFeatured: article.isFeatured,
                isActive: article.isActive,
            }
            : {
                title: '', slug: '', category: '', excerpt: '',
                content: { type: 'doc', content: [] },
                image: '', gallery: [], tags: [],
                author: '', authorInitials: '', date: new Date().toISOString().split('T')[0],
                readTime: '5 min', isFeatured: false, isActive: true,
            },
    });

    const watchedTitle = watch('title');
    const watchedAuthor = watch('author');

    useEffect(() => {
        if (watchedTitle && !article) {
            setValue('slug', generateSlug(watchedTitle));
        }
    }, [watchedTitle, setValue, article]);

    useEffect(() => {
        if (watchedAuthor && !article) {
            const initials = watchedAuthor
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            setValue('authorInitials', initials);
        }
    }, [watchedAuthor, setValue, article]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Colonne principale : 8/12 */}
                <div className="lg:col-span-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Titre <span className="text-red-500">*</span>
                        </label>
                        <input 
                            {...register('title')} 
                            type="text" 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                            placeholder="Titre de l'article" 
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Slug (URL) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">
                                panda-holding.com/actualites/
                            </span>
                            <input 
                                {...register('slug')} 
                                type="text" 
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg text-sm bg-gray-50 focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                                placeholder="mon-article" 
                            />
                        </div>
                        {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Extrait</label>
                        <textarea 
                            {...register('excerpt')} 
                            rows={3} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                            placeholder="En 1-2 phrases, de quoi parle cet article ?" 
                        />
                        {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>}
                    </div>

                    {/* ✅ Suppression de min-h-[500px] - le Tiptap prend sa hauteur naturelle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Contenu <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor 
                            content={watch('content')} 
                            onChange={(content) => setValue('content', content)} 
                            placeholder="Écrivez votre article ici..."
                        />
                    </div>
                </div>

                {/* Sidebar : 4/12 */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Publication</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Catégorie <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    {...register('category')} 
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]"
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de publication</label>
                                <input 
                                    {...register('date')} 
                                    type="date" 
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                                />
                                {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Temps de lecture</label>
                                <input 
                                    {...register('readTime')} 
                                    type="text" 
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                                    placeholder="5 min" 
                                />
                                {errors.readTime && <p className="mt-1 text-xs text-red-600">{errors.readTime.message}</p>}
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        {...register('isFeatured')} 
                                        type="checkbox" 
                                        className="w-4 h-4 text-[#023047] border-gray-300 rounded focus:ring-2 focus:ring-[#023047]/20" 
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        <span className="text-gray-400 mr-1">☆</span>
                                        Mettre en avant
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-6">Affiché en priorité</p>
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        {...register('isActive')} 
                                        type="checkbox" 
                                        className="w-4 h-4 text-[#023047] border-gray-300 rounded focus:ring-2 focus:ring-[#023047]/20" 
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Publié</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Image de couverture</h3>
                        <div className="aspect-[16/9]">
                            <ImageUploader
                                value={watch('image') || ''}
                                onChange={(url) => setValue('image', url)}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Auteur</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nom complet <span className="text-red-500">*</span>
                            </label>
                            <input 
                                {...register('author')} 
                                type="text" 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                                placeholder="Ex: Jean Dupont" 
                            />
                            {errors.author && <p className="mt-1 text-xs text-red-600">{errors.author.message}</p>}
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Les initiales seront générées automatiquement</p>
                    </div>
                </div>

                {/* ✅ Boutons d'action : padding-top uniquement, pas de margin-bottom */}
                <div className="lg:col-span-12 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
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
                        {article ? 'Mettre à jour' : 'Créer l\'article'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ArticleForm;