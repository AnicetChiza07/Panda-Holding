import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { testimonialService } from '../services/testimonialService';
import type { Testimonial, CreateTestimonialData } from '../services/testimonialService';
import Modal from '../components/Modal';
import TestimonialForm from '../components/TestimonialForm';
import ConfirmDialog from '../components/ConfirmDialog';

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ 
        isOpen: false, 
        title: '', 
        message: '', 
        onConfirm: () => {} 
    });

    // ✅ 1. Chargement initial (Sans setIsLoading(true) au début pour éviter l'erreur ESLint)
    useEffect(() => {
        let isMounted = true;

        testimonialService.getAll()
            .then((response) => {
                if (isMounted) {
                    const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                    setTestimonials(data);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.error("Erreur chargement témoignages:", error);
                    toast.error('Impossible de charger les témoignages');
                    setTestimonials([]);
                }
            })
            .finally(() => {
                if (isMounted) {
                    // ✅ Ce setState est DANS un callback (.finally), donc 100% autorisé par ESLint
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // ✅ 2. Fonction de rafraîchissement (appelée uniquement depuis des clics/événements)
    const refreshTestimonials = async () => {
        setIsLoading(true);
        try {
            const response = await testimonialService.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setTestimonials(data);
        } catch (error: unknown) {
            console.error("Erreur rafraîchissement:", error);
            toast.error('Erreur lors du rafraîchissement des données');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ 3. Soumission du formulaire
    const handleFormSubmit = async (data: CreateTestimonialData) => {
        try {
            const payload = {
                ...data,
                name: (data.name || '').trim(),
                role: (data.role || '').trim(), // ✅ AJOUTÉ : Le rôle était manquant
                company: (data.company || '').trim(),
                image: (data.image || '').trim(),
                content: (data.content || '').trim(),
                rating: Number(data.rating) || 5,
                order: Number(data.order) || 0,
                isActive: Boolean(data.isActive),
            };

            if (editingTestimonial) {
                await testimonialService.update(editingTestimonial._id, payload);
                toast.success('Témoignage mis à jour avec succès');
            } else {
                await testimonialService.create(payload);
                toast.success('Témoignage créé avec succès');
            }
            
            setIsModalOpen(false);
            await refreshTestimonials(); // ✅ Appel depuis un événement (clic), pas d'erreur
            
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message ?? 'Erreur lors de l\'enregistrement');
            console.error("Erreur enregistrement:", err);
        }
    };

    // ✅ 4. Suppression
    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true, 
            title: 'Supprimer le témoignage', 
            message: 'Supprimer ce témoignage définitivement ?',
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await testimonialService.delete(id);
                    toast.success('Témoignage supprimé');
                    await refreshTestimonials(); // ✅ Appel depuis un événement (clic)
                } catch (error: unknown) {
                    console.error("Erreur suppression:", error);
                    toast.error('Erreur lors de la suppression');
                }
            }
        });
    };

    const filteredTestimonials = testimonials
        .filter((t) => {
            const nameText = (t.name ?? '').toLowerCase();
            const companyText = (t.company ?? '').toLowerCase();
            const search = searchTerm.toLowerCase();
            const matchesSearch = nameText.includes(search) || companyText.includes(search);
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? t.isActive : !t.isActive);
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => a.order - b.order);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Témoignages</h1>
                    <p className="text-sm text-gray-500 mt-1">{filteredTestimonials.length} témoignage{filteredTestimonials.length > 1 ? 's' : ''} d'affichage</p>
                </div>
                <button 
                    onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }} 
                    className="flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={20} /> Nouveau témoignage
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou entreprise..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {(['all', 'active', 'inactive'] as const).map((status) => (
                        <button 
                            key={status} 
                            onClick={() => setStatusFilter(status)} 
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 md:flex-none ${
                                statusFilter === status 
                                    ? 'bg-[#023047] text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : 'Inactifs'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grille de témoignages */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                </div>
            ) : filteredTestimonials.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Aucun témoignage trouvé</h3>
                    <p className="text-gray-500 mt-1 mb-6">Ajoutez votre premier témoignage client.</p>
                    <button 
                        onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }} 
                        className="inline-flex items-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                    >
                        <Plus size={18} /> Créer un témoignage
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTestimonials.map((testimonial) => (
                        <div 
                            key={testimonial._id} 
                            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="aspect-square bg-gray-100/50 relative overflow-hidden">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-[#023047] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                    #{testimonial.order}
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-white flex flex-col flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                                    {testimonial.name}
                                </h3>
                                <p className="text-xs text-gray-500 mb-2">{testimonial.role}, {testimonial.company}</p>
                                <p className="text-xs text-gray-600 line-clamp-3 mb-3 flex-1 italic">"{testimonial.content}"</p>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                        testimonial.isActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {testimonial.isActive ? 'Actif' : 'Inactif'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => { setEditingTestimonial(testimonial); setIsModalOpen(true); }} 
                                            className="p-1.5 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(testimonial._id)} 
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'} 
                size="lg"
            >
                <TestimonialForm 
                    testimonial={editingTestimonial} 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>

            <ConfirmDialog 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                onConfirm={confirmModal.onConfirm} 
                title={confirmModal.title} 
                message={confirmModal.message} 
            />
        </div>
    );
};

export default TestimonialsPage;