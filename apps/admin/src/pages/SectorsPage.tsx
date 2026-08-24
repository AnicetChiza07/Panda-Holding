import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Building2, Loader2, FolderOpen, Tag, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { sectorService } from '../services/sectorService';
import type { Sector, SectorFormData } from '../types/sector';
import Modal from '../components/Modal';
import SectorForm from '../components/SectorForm';
import ConfirmDialog from '../components/ConfirmDialog';

const SectorsPage = () => {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSector, setEditingSector] = useState<Sector | null>(null);
    const [categories, setCategories] = useState<string[]>(['Immobilier', 'Finance', 'Énergie', 'Technologie']);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        const fetchSectors = async () => {
            setIsLoading(true);
            try {
                const data = await sectorService.getAll();
                setSectors(data);
            } catch (error: unknown) {
                console.error("Erreur lors du chargement des secteurs:", error);
                toast.error('Impossible de charger les secteurs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSectors();
    }, []);

    const handleCreate = () => {
        setEditingSector(null);
        setIsModalOpen(true);
    };

    const handleEdit = (sector: Sector) => {
        setEditingSector(sector);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: SectorFormData) => {
        try {
            // Transformation stricte pour garantir la compatibilité avec le backend
            const sectorPayload = {
                name: data.name.trim(),
                slug: data.slug.trim(),
                shortDescription: data.shortDescription.trim(),
                // On envoie l'objet Tiptap complet. Si le backend attend un tableau, il prendra .content
                longDescription: data.longDescription, 
                coverImage: data.coverImage.trim(),
                image: data.coverImage.trim() || (data.images[0] || '').trim(), // Fallback pour compatibilité ancien schéma
                images: data.images.filter(img => img && img.trim() !== ''),
                category: data.category.trim(),
                expertises: data.expertises.filter(exp => exp.trim() !== ''),
                subSectors: [],
                realizations: [],
                isActive: data.isActive,
            };

            console.log("📦 PAYLOAD ENVOYÉ AU BACKEND:", sectorPayload);

            if (editingSector) {
                await sectorService.update(editingSector._id, sectorPayload);
                toast.success('Secteur mis à jour avec succès');
                setSectors(prev => prev.map(s => s._id === editingSector._id ? { ...s, ...sectorPayload } : s));
            } else {
                const newSector = await sectorService.create(sectorPayload);
                toast.success('Secteur créé avec succès');
                setSectors(prev => [newSector, ...prev]);
            }
            setIsModalOpen(false);
        } catch (error: unknown) {
            console.error("ERREUR DÉTAILLÉE DU BACKEND:", error);
            
            let msg = 'Erreur de validation. Vérifiez que tous les champs obligatoires sont remplis.';
            
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                msg = err.response?.data?.message || msg;
            } else if (error instanceof Error) {
                msg = error.message;
            }
            
            toast.error(msg);
        }
    };

    const handleDelete = (id: string, name: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Supprimer le secteur',
            message: `Êtes-vous sûr de vouloir supprimer le secteur "${name}" ? Cette action est irréversible.`,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await sectorService.delete(id);
                    toast.success('Secteur supprimé avec succès');
                    setSectors(prev => prev.filter(sector => sector._id !== id));
                } catch (error: unknown) {
                    console.error("Erreur lors de la suppression:", error);
                    toast.error('Erreur lors de la suppression du secteur');
                }
            }
        });
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            toast.error('Veuillez entrer un nom de catégorie');
            return;
        }
        if (categories.includes(newCategory.trim())) {
            toast.error('Cette catégorie existe déjà');
            return;
        }
        setCategories(prev => [...prev, newCategory.trim()]);
        setNewCategory('');
        toast.success('Catégorie ajoutée');
    };

    const handleDeleteCategory = (category: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Supprimer la catégorie',
            message: `Voulez-vous vraiment supprimer la catégorie "${category}" ?`,
            onConfirm: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                setCategories(prev => prev.filter(c => c !== category));
                toast.success('Catégorie supprimée');
            }
        });
    };

    const handleStartEditCategory = (index: number, name: string) => {
        setEditingCategoryIndex(index);
        setEditingCategoryName(name);
    };

    const handleSaveEditCategory = () => {
        if (editingCategoryIndex === null) return;
        const newName = editingCategoryName.trim();
        if (!newName) {
            toast.error('Le nom ne peut pas être vide');
            return;
        }
        if (categories.includes(newName) && newName !== categories[editingCategoryIndex]) {
            toast.error('Cette catégorie existe déjà');
            return;
        }
        setCategories(prev => prev.map((c, i) => i === editingCategoryIndex ? newName : c));
        setEditingCategoryIndex(null);
        setEditingCategoryName('');
        toast.success('Catégorie modifiée');
    };

    const handleCancelEditCategory = () => {
        setEditingCategoryIndex(null);
        setEditingCategoryName('');
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-[#023047]">Gestion des Secteurs</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez les domaines d'activité de Panda Holding.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={18} />
                    Ajouter un secteur
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <FolderOpen className="w-5 h-5 text-[#023047]" />
                    <h2 className="text-lg font-display font-bold text-[#023047]">Catégories</h2>
                    <span className="text-sm text-gray-500">({categories.length})</span>
                </div>

                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        placeholder="Nouvelle catégorie (ex: Immobilier, Finance...)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all text-sm"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#023047] hover:bg-[#011f2e] text-white rounded-lg text-sm font-semibold transition-all"
                    >
                        <Plus size={16} />
                        Créer une catégorie
                    </button>
                </div>

                {categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <div key={category} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                                {editingCategoryIndex === index ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editingCategoryName}
                                            onChange={(e) => setEditingCategoryName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEditCategory();
                                                if (e.key === 'Escape') handleCancelEditCategory();
                                            }}
                                            autoFocus
                                            className="px-2 py-1 border border-[#023047] rounded text-sm w-40 focus:outline-none focus:ring-1 focus:ring-[#023047]"
                                        />
                                        <button onClick={handleSaveEditCategory} className="text-green-600 hover:text-green-700 p-1" title="Sauvegarder">
                                            <Edit size={14} />
                                        </button>
                                        <button onClick={handleCancelEditCategory} className="text-gray-500 hover:text-gray-700 p-1" title="Annuler">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Tag className="w-3.5 h-3.5 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">{category}</span>
                                        <button onClick={() => handleStartEditCategory(index, category)} className="text-gray-400 hover:text-[#023047] transition-colors p-0.5" title="Modifier">
                                            <Pencil size={12} />
                                        </button>
                                        <button onClick={() => handleDeleteCategory(category)} className="text-gray-400 hover:text-red-600 transition-colors p-0.5" title="Supprimer">
                                            <Trash2 size={12} />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Aucune catégorie créée</p>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                    <span className="ml-3 text-gray-600 font-medium">Chargement des données...</span>
                </div>
            ) : sectors.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Aucun secteur trouvé</h3>
                    <p className="text-gray-500 mt-1 mb-6">Commencez par ajouter votre premier domaine d'activité.</p>
                    <button onClick={handleCreate} className="text-[#023047] font-semibold hover:underline">
                        Créer un secteur maintenant
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Secteur</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sectors.map((sector) => (
                                    <tr key={sector._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={sector.coverImage || sector.image || 'https://via.placeholder.com/48'} 
                                                    alt={sector.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{sector.name}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">{sector.shortDescription}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                                <Tag className="w-3 h-3" />
                                                {sector.category || 'Non catégorisé'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                sector.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {sector.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(sector)} className="p-2 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors" title="Modifier">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(sector._id, sector.name)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                    <Trash2 size={18} />
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
                title={editingSector ? 'Modifier le secteur' : 'Créer un nouveau secteur'}
                size="lg"
            >
                <SectorForm
                    sector={editingSector}
                    categories={categories}
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

export default SectorsPage;