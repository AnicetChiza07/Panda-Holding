import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { carouselService } from '../services/carouselService';
import type { CarouselSlide, CarouselSlideFormData } from '../types/carousel';
import Modal from '../components/Modal';
import CarouselForm from '../components/CarouselForm';
import ConfirmDialog from '../components/ConfirmDialog';

const CarouselPage = () => {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        const fetchSlides = async () => {
            setIsLoading(true);
            try {
                const data = await carouselService.getAll();
                setSlides(Array.isArray(data) ? data : []);
            } catch (error: unknown) {
                console.error("Erreur chargement carrousel:", error);
                toast.error('Impossible de charger les slides');
                setSlides([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlides();
    }, []);

    const handleFormSubmit = async (data: CarouselSlideFormData) => {
        try {
            const payload = {
                ...data,
                image: (data.image || '').trim(),
                title: (data.title || '').trim(),
                description: (data.description || '').trim(),
                order: Number(data.order) || 0,
                isActive: Boolean(data.isActive),
            };

            if (editingSlide) {
                await carouselService.update(editingSlide._id, payload);
                toast.success('Slide mise à jour');
                setSlides(prev => prev.map(s => s._id === editingSlide._id ? { ...s, ...payload } : s));
            } else {
                const newSlide = await carouselService.create(payload);
                toast.success('Slide créée');
                setSlides(prev => [...prev, newSlide].sort((a, b) => a.order - b.order));
            }
            setIsModalOpen(false);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message ?? 'Erreur lors de l\'enregistrement');
            console.error("Erreur enregistrement:", err);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true, 
            title: 'Supprimer la slide', 
            message: 'Supprimer cette slide définitivement ?',
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await carouselService.delete(id);
                    toast.success('Slide supprimée');
                    setSlides(prev => prev.filter(s => s._id !== id));
                } catch (error: unknown) {
                    console.error("Erreur suppression:", error);
                    toast.error('Erreur lors de la suppression');
                }
            }
        });
    };

    const filteredSlides = slides
        .filter((s) => {
            const titleText = (s.title ?? '').toLowerCase();
            const search = searchTerm.toLowerCase();
            const matchesSearch = titleText.includes(search);
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? s.isActive : !s.isActive);
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => a.order - b.order);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Carrousel / Bannières</h1>
                    <p className="text-sm text-gray-500 mt-1">{filteredSlides.length} slide{filteredSlides.length > 1 ? 's' : ''} d'affichage</p>
                </div>
                <button 
                    onClick={() => { setEditingSlide(null); setIsModalOpen(true); }} 
                    className="flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={20} /> Nouvelle slide
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par titre..." 
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
                            {status === 'all' ? 'Toutes' : status === 'active' ? 'Actives' : 'Inactives'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grille de slides */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                </div>
            ) : filteredSlides.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Aucune slide trouvée</h3>
                    <p className="text-gray-500 mt-1 mb-6">Ajoutez votre première bannière.</p>
                    <button 
                        onClick={() => { setEditingSlide(null); setIsModalOpen(true); }} 
                        className="inline-flex items-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                    >
                        <Plus size={18} /> Créer une slide
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSlides.map((slide) => (
                        <div 
                            key={slide._id} 
                            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            {/* Image de la slide */}
                            <div className="aspect-[16/9] bg-gray-100/50 relative overflow-hidden">
                                <img 
                                    src={slide.image} 
                                    alt={slide.title || 'Slide'} 
                                    className="w-full h-full object-cover"
                                />
                                {/* Badge ordre en haut à gauche */}
                                <div className="absolute top-3 left-3 bg-[#023047] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                    #{slide.order}
                                </div>
                            </div>

                            {/* Footer de la carte - Design corrigé */}
                            <div className="p-4 border-t border-gray-100 bg-white flex flex-col flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                                    {slide.title || 'Sans titre'}
                                </h3>
                                {slide.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{slide.description}</p>
                                )}
                                
                                {/* ✅ Statut à gauche, Icônes à droite sur la même ligne */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                        slide.isActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {slide.isActive ? 'Active' : 'Inactive'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => { setEditingSlide(slide); setIsModalOpen(true); }} 
                                            className="p-1.5 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(slide._id)} 
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

            {/* Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingSlide ? 'Modifier la slide' : 'Nouvelle slide'} 
                size="lg"
            >
                <CarouselForm 
                    slide={editingSlide} 
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

export default CarouselPage;