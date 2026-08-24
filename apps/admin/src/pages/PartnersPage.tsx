import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Loader2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { partnerService } from '../services/partnerService';
import type { Partner, PartnerFormData } from '../types/partner';
import Modal from '../components/Modal';
import PartnerForm from '../components/PartnerForm';
import ConfirmDialog from '../components/ConfirmDialog';

const PartnersPage = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        const fetchPartners = async () => {
            setIsLoading(true);
            try {
                const data = await partnerService.getAll();
                setPartners(data);
            } catch (error: unknown) {
                console.error("Erreur chargement partenaires:", error);
                toast.error('Impossible de charger les partenaires');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPartners();
    }, []);

    const handleFormSubmit = async (data: PartnerFormData) => {
        try {
            const payload = {
                ...data,
                name: data.name.trim(),
                logo: data.logo.trim(),
            };

            if (editingPartner) {
                await partnerService.update(editingPartner._id, payload);
                toast.success('Partenaire mis à jour');
                setPartners(prev => prev.map(p => p._id === editingPartner._id ? { ...p, ...payload } : p));
            } else {
                const newPartner = await partnerService.create(payload);
                toast.success('Partenaire ajouté');
                setPartners(prev => [newPartner, ...prev]);
            }
            setIsModalOpen(false);
        } catch (error: unknown) {
            console.error("Erreur enregistrement:", error);
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = (id: string, name: string) => {
        setConfirmModal({
            isOpen: true, title: 'Supprimer le partenaire', message: `Supprimer "${name}" définitivement ?`,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await partnerService.delete(id);
                    toast.success('Partenaire supprimé');
                    setPartners(prev => prev.filter(p => p._id !== id));
                } catch (error: unknown) {
                    console.error("Erreur suppression:", error);
                    toast.error('Erreur lors de la suppression');
                }
            }
        });
    };

    const filteredPartners = partners.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? p.isActive : !p.isActive;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Logos Partenaires</h1>
                    <p className="text-sm text-gray-500 mt-1">{filteredPartners.length} partenaire{filteredPartners.length > 1 ? 's' : ''}</p>
                </div>
                <button 
                    onClick={() => { setEditingPartner(null); setIsModalOpen(true); }} 
                    className="flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={20} /> Nouveau partenaire
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un partenaire..." 
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

            {/* Grille de partenaires */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                </div>
            ) : filteredPartners.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Aucun partenaire trouvé</h3>
                    <p className="text-gray-500 mt-1 mb-6">Ajoutez votre premier partenaire.</p>
                    <button 
                        onClick={() => { setEditingPartner(null); setIsModalOpen(true); }} 
                        className="inline-flex items-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                    >
                        <Plus size={18} /> Ajouter un partenaire
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPartners.map((partner) => (
                        <div 
                            key={partner._id} 
                            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            {/* Logo avec bg gris subtil */}
                            <div className="aspect-[4/3] bg-gray-100/50 p-6 flex items-center justify-center">
                                <img 
                                    src={partner.logo} 
                                    alt={partner.name} 
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            {/* Footer de la carte - Icônes toujours visibles */}
                            <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
                                <span className="text-xs font-medium">
                                    {partner.isActive ? (
                                        <span className="inline-flex items-center gap-1.5 text-green-600">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-gray-400">
                                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                            Inactif
                                        </span>
                                    )}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => { setEditingPartner(partner); setIsModalOpen(true); }} 
                                        className="p-1.5 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(partner._id, partner.name)} 
                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingPartner ? 'Modifier le partenaire' : 'Nouveau partenaire'} 
                size="md"
            >
                <PartnerForm 
                    partner={editingPartner} 
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

export default PartnersPage;