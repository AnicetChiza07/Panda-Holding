import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSONContent } from '@tiptap/react';
import type { Faq } from '../types/faq';
import { faqSchema, type FaqFormData } from '../types/faq';
import RichTextEditor from './RichTextEditor';

interface FaqFormProps {
    faq?: Faq | null;
    onSubmit: (data: FaqFormData) => Promise<void>;
    onCancel: () => void;
}

const normalizeContent = (content: JSONContent | JSONContent[] | null | undefined): JSONContent => {
    if (!content) return { type: 'doc', content: [] };
    if (typeof content === 'object' && 'type' in content && content.type === 'doc' && Array.isArray((content as JSONContent).content)) return content as JSONContent;
    if (Array.isArray(content)) return { type: 'doc', content };
    return { type: 'doc', content: [] };
};

const FaqForm = ({ faq, onSubmit, onCancel }: FaqFormProps) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FaqFormData>({
        resolver: zodResolver(faqSchema),
        defaultValues: faq
            ? {
                question: faq.question,
                answer: normalizeContent(faq.answer),
                order: faq.order,
                isActive: faq.isActive,
            }
            : {
                question: '',
                answer: { type: 'doc', content: [] },
                order: 0,
                isActive: true,
            },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
                {/* Question */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Question <span className="text-red-500">*</span>
                    </label>
                    <input 
                        {...register('question')} 
                        type="text" 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                        placeholder="Ex: Quels sont vos services ?" 
                    />
                    {errors.question && <p className="mt-1 text-xs text-red-600">{errors.question.message}</p>}
                </div>

                {/* Réponse */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Réponse <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor 
                        content={watch('answer')} 
                        onChange={(content) => setValue('answer', content)} 
                        placeholder="Rédigez la réponse..."
                    />
                </div>

                {/* Ordre et Statut côte à côte */}
                <div className="grid grid-cols-2 gap-6">
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
                        {errors.order && <p className="mt-1 text-xs text-red-600">{errors.order.message}</p>}
                        <p className="text-xs text-gray-500 mt-1">Les numéros les plus bas s'affichent en premier</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Statut</p>
                            <p className="text-xs text-gray-500 mt-0.5">Visible sur le site</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                {...register('isActive')} 
                                type="checkbox" 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#023047]"></div>
                        </label>
                    </div>
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
                    {faq ? 'Mettre à jour' : 'Créer la FAQ'}
                </button>
            </div>
        </form>
    );
};

export default FaqForm;