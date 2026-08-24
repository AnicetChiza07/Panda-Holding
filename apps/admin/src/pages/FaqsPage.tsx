import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Loader2, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { faqService } from '../services/faqService';
import type { Faq, FaqFormData } from '../types/faq';
import Modal from '../components/Modal';
import FaqForm from '../components/FaqForm';
import ConfirmDialog from '../components/ConfirmDialog';

// ✅ Interface dédiée pour typer l'erreur proprement SANS utiliser 'any'
interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const FaqsPage = () => {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ 
        isOpen: false, title: '', message: '', onConfirm: () => {} 
    });

    useEffect(() => {
        const fetchFaqs = async () => {
            setIsLoading(true);
            try {
                const data = await faqService.getAll();
                setFaqs(Array.isArray(data) ? data : []);
            } catch (error: unknown) {
                console.error("Erreur chargement FAQ:", error);
                toast.error('Impossible de charger les FAQ');
                setFaqs([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const handleFormSubmit = async (data: FaqFormData) => {
        try {
            // ✅ Nettoyage strict des données avant l'envoi au backend
            const payload = {
                question: (data.question || '').trim(),
                answer: data.answer || { type: 'doc', content: [] },
                order: typeof data.order === 'number' ? data.order : 0,
                isActive: Boolean(data.isActive),
            };

            if (editingFaq) {
                await faqService.update(editingFaq._id, payload);
                toast.success('FAQ mise à jour');
                setFaqs(prev => prev.map(f => f._id === editingFaq._id ? { ...f, ...payload } : f));
            } else {
                const newFaq = await faqService.create(payload);
                toast.success('FAQ créée');
                setFaqs(prev => [newFaq, ...prev]);
            }
            setIsModalOpen(false);
        } catch (error: unknown) {
            console.error("Erreur enregistrement détaillée:", error);
            
            // ✅ Typage strict via l'interface, ZÉRO 'any'
            const err = error as AxiosErrorResponse;
            const errorMsg = err?.response?.data?.message ?? 'Erreur lors de l\'enregistrement';
            
            toast.error(errorMsg);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true, 
            title: 'Supprimer la FAQ', 
            message: 'Supprimer cette question définitivement ?',
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await faqService.delete(id);
                    toast.success('FAQ supprimée');
                    setFaqs(prev => prev.filter(f => f._id !== id));
                } catch (error: unknown) {
                    console.error("Erreur suppression:", error);
                    toast.error('Erreur lors de la suppression');
                }
            }
        });
    };

    // ✅ Filtre propre, typé implicitement comme Faq, sans 'any'
    const filteredFaqs = faqs.filter((f) => {
        const questionText = (f.question ?? '').toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch = questionText.includes(search);
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? f.isActive : !f.isActive);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Gestion des FAQ</h1>
                    <p className="text-sm text-gray-500 mt-1">{filteredFaqs.length} question{filteredFaqs.length > 1 ? 's' : ''} fréquente{filteredFaqs.length > 1 ? 's' : ''}</p>
                </div>
                <button 
                    onClick={() => { setEditingFaq(null); setIsModalOpen(true); }} 
                    className="flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={20} /> Nouvelle FAQ
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une question..." 
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

            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                </div>
            ) : filteredFaqs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Aucune FAQ trouvée</h3>
                    <p className="text-gray-500 mt-1 mb-6">Ajoutez votre première question fréquente.</p>
                    <button 
                        onClick={() => { setEditingFaq(null); setIsModalOpen(true); }} 
                        className="inline-flex items-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                    >
                        <Plus size={18} /> Créer une FAQ
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[60%]">Question</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Ordre</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Statut</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[10%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredFaqs.map((faq) => (
                                    <tr key={faq._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 text-sm line-clamp-2">{faq.question ?? 'Question non définie'}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                                {faq.order ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                                faq.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {faq.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => { setEditingFaq(faq); setIsModalOpen(true); }} 
                                                    className="p-2 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(faq._id)} 
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingFaq ? 'Modifier la FAQ' : 'Nouvelle FAQ'} 
                size="lg"
            >
                <FaqForm 
                    faq={editingFaq} 
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

export default FaqsPage;