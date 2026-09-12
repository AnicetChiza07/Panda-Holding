import { useState } from 'react';
import { Upload } from 'lucide-react';
import type { Testimonial, CreateTestimonialData } from '../services/testimonialService';

interface TestimonialFormProps {
    testimonial: Testimonial | null;
    onSubmit: (data: CreateTestimonialData) => Promise<void>;
    onCancel: () => void;
}

const TestimonialForm = ({ testimonial, onSubmit, onCancel }: TestimonialFormProps) => {
    const [formData, setFormData] = useState<CreateTestimonialData>(() => ({
        name: testimonial?.name || '',
        role: testimonial?.role || '',
        company: testimonial?.company || '',
        image: testimonial?.image || '',
        content: testimonial?.content || '',
        rating: testimonial?.rating || 5,
        isActive: testimonial?.isActive ?? true,
        order: testimonial?.order || 0
    }));
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* LAYOUT EN 2 COLONNES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ═══════════════════════════════════════
                    COLONNE GAUCHE : Infos + Témoignage
                    ═══════════════════════════════════════ */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Nom complet <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required 
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] outline-none" 
                            placeholder="Ex: Jean KAPITA"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Entreprise <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required 
                            type="text" 
                            value={formData.company} 
                            onChange={e => setFormData({...formData, company: e.target.value})} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] outline-none" 
                            placeholder="Ex: Congo Industries"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Poste <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required 
                            type="text" 
                            value={formData.role} 
                            onChange={e => setFormData({...formData, role: e.target.value})} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] outline-none" 
                            placeholder="Ex: Directeur Général"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Témoignage <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            required 
                            rows={5} 
                            value={formData.content} 
                            onChange={e => setFormData({...formData, content: e.target.value})} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] outline-none resize-none" 
                            placeholder="Ex: Panda Holding a transformé notre approche stratégique..." 
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════
                    COLONNE DROITE : Image + Options
                    ═══════════════════════════════════════ */}
                <div className="space-y-4">
                    {/* Image de profil */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Photo de profil <span className="text-red-500">*</span>
                        </label>
                        {formData.image && (
                            <div className="mb-3 flex justify-center">
                                <img 
                                    src={formData.image} 
                                    alt="Preview" 
                                    className="w-32 h-32 rounded-full object-cover border-2 border-[#023047]/20" 
                                />
                            </div>
                        )}
                        <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-[#023047] transition-colors text-sm font-medium text-gray-700">
                            <Upload className="w-4 h-4" />
                            Choisir une image
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="hidden" 
                            />
                        </label>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Note (1-5) <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required 
                            type="number" 
                            min="1" 
                            max="5" 
                            value={formData.rating} 
                            onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] outline-none" 
                        />
                    </div>

                    {/* Ordre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ordre d'affichage
                        </label>
                        <input 
                            type="number" 
                            value={formData.order} 
                            onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] outline-none" 
                        />
                    </div>

                    {/* Publier */}
                    <div className="flex items-center gap-2 pt-1">
                        <input 
                            type="checkbox" 
                            id="isActive"
                            checked={formData.isActive} 
                            onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                            className="w-4 h-4 text-[#023047] rounded focus:ring-[#023047]" 
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Publier (Actif)
                        </label>
                    </div>
                </div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#023047] hover:bg-[#011f2e] text-white rounded-lg transition-colors text-sm font-semibold disabled:opacity-50"
                >
                    {isSubmitting ? 'Enregistrement...' : (testimonial ? 'Mettre à jour' : 'Créer')}
                </button>
            </div>
        </form>
    );
};

export default TestimonialForm;