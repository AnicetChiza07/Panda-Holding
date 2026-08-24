import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FolderOpen, Pencil, Tag, Search, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../services/projectService';
import type { Project, ProjectFormData } from '../types/project';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import ConfirmDialog from '../components/ConfirmDialog';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [categories, setCategories] = useState<string[]>(['Immobilier Résidentiel', 'Immobilier Commercial', 'Aménagement', 'Rénovation']);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const data = await projectService.getAll();
                setProjects(data);
            } catch (error: unknown) {
                console.error("Erreur chargement projets:", error);
                toast.error('Impossible de charger les projets');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleFormSubmit = async (data: ProjectFormData) => {
        try {
            const payload = {
                ...data,
                title: data.title.trim(),
                slug: data.slug.trim(),
                category: data.category.trim(),
                location: data.location.trim(),
                shortDescription: data.shortDescription.trim(),
                image: data.image.trim(),
                gallery: data.gallery.filter(img => img && img.trim() !== ''),
            };

            if (editingProject) {
                await projectService.update(editingProject._id, payload);
                toast.success('Projet mis à jour');
                setProjects(prev => prev.map(p => p._id === editingProject._id ? { ...p, ...payload } : p));
            } else {
                const newProject = await projectService.create(payload);
                toast.success('Projet créé');
                setProjects(prev => [newProject, ...prev]);
            }
            setIsModalOpen(false);
        } catch (error: unknown) {
            console.error("Erreur enregistrement:", error);
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = (id: string, title: string) => {
        setConfirmModal({
            isOpen: true, title: 'Supprimer le projet', message: `Supprimer "${title}" définitivement ?`,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await projectService.delete(id);
                    toast.success('Projet supprimé');
                    setProjects(prev => prev.filter(p => p._id !== id));
                } catch (error: unknown) { // ✅ Correction ici : typage + console.error
                    console.error("Erreur suppression:", error);
                    toast.error('Erreur lors de la suppression');
                }
            }
        });
    };

    // Gestion des catégories
    const handleAddCategory = () => {
        if (!newCategory.trim() || categories.includes(newCategory.trim())) {
            toast.error('Catégorie invalide ou existante');
            return;
        }
        setCategories(prev => [...prev, newCategory.trim()]);
        setNewCategory('');
        toast.success('Catégorie ajoutée');
    };
    const handleDeleteCategory = (cat: string) => {
        setConfirmModal({ isOpen: true, title: 'Supprimer', message: `Supprimer "${cat}" ?`, onConfirm: () => {
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            setCategories(prev => prev.filter(c => c !== cat));
            toast.success('Catégorie supprimée');
        }});
    };
    const handleStartEditCategory = (index: number, name: string) => { setEditingCategoryIndex(index); setEditingCategoryName(name); };
    const handleSaveEditCategory = () => {
        if (editingCategoryIndex === null) return;
        const newName = editingCategoryName.trim();
        if (!newName || (categories.includes(newName) && newName !== categories[editingCategoryIndex])) {
            toast.error('Nom invalide ou existant'); return;
        }
        setCategories(prev => prev.map((c, i) => i === editingCategoryIndex ? newName : c));
        setEditingCategoryIndex(null); setEditingCategoryName('');
        toast.success('Catégorie modifiée');
    };
    const handleCancelEditCategory = () => { setEditingCategoryIndex(null); setEditingCategoryName(''); };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? p.isActive : !p.isActive;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-[#023047]">Gestion des Projets</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez les réalisations et projets de Panda Holding.</p>
                </div>
                <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                    <Plus size={18} /> Nouveau projet
                </button>
            </div>

            {/* Catégories */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <FolderOpen className="w-5 h-5 text-[#023047]" />
                    <h2 className="text-lg font-display font-bold text-[#023047]">Catégories de projets</h2>
                </div>
                <div className="flex gap-3 mb-4">
                    <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()} placeholder="Nouvelle catégorie..." className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" />
                    <button onClick={handleAddCategory} className="flex items-center gap-2 px-4 py-2.5 bg-[#023047] hover:bg-[#011f2e] text-white rounded-lg text-sm font-semibold"><Plus size={16} /> Créer</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                        <div key={category} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                            {editingCategoryIndex === index ? (
                                <div className="flex items-center gap-2">
                                    <input type="text" value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEditCategory(); if (e.key === 'Escape') handleCancelEditCategory(); }} autoFocus className="px-2 py-1 border border-[#023047] rounded text-sm w-40 focus:outline-none" />
                                    <button onClick={handleSaveEditCategory} className="text-green-600 p-1"><Edit size={14} /></button>
                                    <button onClick={handleCancelEditCategory} className="text-gray-500 p-1"><Trash2 size={14} /></button>
                                </div>
                            ) : (
                                <>
                                    <Tag className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">{category}</span>
                                    <button onClick={() => handleStartEditCategory(index, category)} className="text-gray-400 hover:text-[#023047] p-0.5"><Pencil size={12} /></button>
                                    <button onClick={() => handleDeleteCategory(category)} className="text-gray-400 hover:text-red-600 p-0.5"><Trash2 size={12} /></button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Rechercher par titre ou lieu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {(['all', 'active', 'inactive'] as const).map((status) => (
                        <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 md:flex-none ${statusFilter === status ? 'bg-[#023047] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : 'Inactifs'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tableau */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700">Aucun projet trouvé</h3>
                    <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="mt-4 inline-flex items-center gap-2 bg-[#023047] text-white px-6 py-3 rounded-lg font-semibold">Créer votre premier projet</button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Projet</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Catégorie</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Lieu</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">Statut</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[10%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProjects.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-4">
                                                <img src={project.image || 'https://via.placeholder.com/48'} alt={project.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{project.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.shortDescription}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium whitespace-nowrap">
                                                <Tag className="w-3 h-3" /> {project.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="truncate max-w-[150px]">{project.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {project.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => { setEditingProject(project); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors" title="Modifier"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(project._id, project.title)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Modifier le projet' : 'Créer un nouveau projet'} size="lg">
                <ProjectForm project={editingProject} categories={categories} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <ConfirmDialog isOpen={confirmModal.isOpen} onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} onConfirm={confirmModal.onConfirm} title={confirmModal.title} message={confirmModal.message} />
        </div>
    );
};

export default ProjectsPage;