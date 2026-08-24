import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FileText, Loader2, Tag, Search, FolderOpen, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { articleService } from '../services/articleService';
import type { Article, ArticleFormData } from '../types/article';
import Modal from '../components/Modal';
import ArticleForm from '../components/ArticleForm';
import ConfirmDialog from '../components/ConfirmDialog';

const ArticlesPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [categories, setCategories] = useState<string[]>(['Actualités', 'Communiqués', 'Analyses', 'Événements']);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const data = await articleService.getAll();
                setArticles(data);
            } catch (error: unknown) {
                console.error("Erreur lors du chargement des articles:", error);
                toast.error('Impossible de charger les articles');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleCreate = () => {
        setEditingArticle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (article: Article) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: ArticleFormData) => {
        try {
            const articlePayload = {
                title: data.title.trim(),
                slug: data.slug.trim(),
                category: data.category.trim(),
                excerpt: data.excerpt.trim(),
                content: data.content,
                image: data.image.trim(),
                gallery: [],
                tags: [],
                author: data.author.trim(),
                authorInitials: data.authorInitials.trim().toUpperCase(),
                date: data.date,
                readTime: data.readTime.trim(),
                isFeatured: data.isFeatured,
                isActive: data.isActive,
            };

            if (editingArticle) {
                await articleService.update(editingArticle._id, articlePayload);
                toast.success('Article mis à jour avec succès');
                setArticles(prev => prev.map(a => a._id === editingArticle._id ? { ...a, ...articlePayload } : a));
            } else {
                const newArticle = await articleService.create(articlePayload);
                toast.success('Article créé avec succès');
                setArticles(prev => [newArticle, ...prev]);
            }
            setIsModalOpen(false);
        } catch (error: unknown) {
            console.error("Erreur:", error);
            toast.error('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = (id: string, title: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Supprimer l\'article',
            message: `Êtes-vous sûr de vouloir supprimer l'article "${title}" ? Cette action est irréversible.`,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                try {
                    await articleService.delete(id);
                    toast.success('Article supprimé avec succès');
                    setArticles(prev => prev.filter(article => article._id !== id));
                } catch (error: unknown) {
                    console.error("Erreur lors de la suppression:", error);
                    toast.error('Erreur lors de la suppression de l\'article');
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

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              article.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true : 
                              statusFilter === 'active' ? article.isActive : !article.isActive;
        return matchesSearch && matchesStatus;
    });

    // Fonction pour limiter le texte
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-[#023047]">Gestion des Articles</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez les actualités et publications de Panda Holding.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={18} />
                    Nouvel article
                </button>
            </div>

            {/* Section Catégories */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <FolderOpen className="w-5 h-5 text-[#023047]" />
                    <h2 className="text-lg font-display font-bold text-[#023047]">Catégories d'articles</h2>
                    <span className="text-sm text-gray-500">({categories.length})</span>
                </div>

                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        placeholder="Nouvelle catégorie (ex: Actualités, Communiqués...)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047] transition-all text-sm"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#023047] hover:bg-[#011f2e] text-white rounded-lg text-sm font-semibold transition-all"
                    >
                        <Plus size={16} />
                        Créer
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

            {/* Filtres et Recherche */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par titre ou auteur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]"
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
                            {status === 'all' ? 'Tous' : status === 'active' ? 'Publiés' : 'Brouillons'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste des articles */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                    <span className="ml-3 text-gray-600 font-medium">Chargement des données...</span>
                </div>
            ) : filteredArticles.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Aucun article trouvé</h3>
                    <p className="text-gray-500 mt-1 mb-6">Commencez par rédiger votre premier article.</p>
                    <button 
                        onClick={handleCreate} 
                        className="inline-flex items-center gap-2 bg-[#023047] hover:bg-[#011f2e] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus size={18} />
                        Créer votre premier article
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[45%]">Article</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Auteur</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredArticles.map((article) => (
                                    <tr key={article._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-4">
                                                <img 
                                                    src={article.image || 'https://via.placeholder.com/48'} 
                                                    alt={article.title}
                                                    className="w-18 h-18 rounded-lg object-cover border border-gray-200 shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{article.title}</p>
                                                    {article.excerpt && (
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                            {truncateText(article.excerpt, 80)}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(article.date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium whitespace-nowrap">
                                                <Tag className="w-3 h-3" />
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#023047] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                                    {article.authorInitials}
                                                </div>
                                                <span className="text-xs text-gray-700 truncate max-w-[120px]">{article.author}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                                article.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {article.isActive ? 'Publié' : 'Brouillon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(article)}
                                                    className="p-2 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article._id, article.title)}
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
                title={editingArticle ? 'Modifier l\'article' : 'Créer un nouvel article'}
                size="lg"
            >
                <ArticleForm
                    article={editingArticle}
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

export default ArticlesPage;