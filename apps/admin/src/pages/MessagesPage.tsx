import { useState, useEffect } from 'react';
import { Trash2, Search, Loader2, Mail, MailOpen, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { messageService } from '../services/messageService';
import type { ContactMessage } from '../types/message';
import MessageDetailModal from '../components/MessageDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';

const MessagesPage = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');

    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ 
        isOpen: false, title: '', message: '', onConfirm: () => {} 
    });

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await messageService.getAll();
                setMessages(Array.isArray(data) ? data : []);
            } catch (error: unknown) {
                console.error("Erreur chargement messages:", error);
                toast.error('Impossible de charger les messages');
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            const updatedMessage = await messageService.markAsRead(id);
            toast.success('Message marqué comme lu');
            setMessages(prev => prev.map(m => m._id === id ? updatedMessage : m));
            if (selectedMessage && selectedMessage._id === id) {
                setSelectedMessage(updatedMessage);
            }
        } catch (error: unknown) {
            console.error("Erreur markAsRead:", error);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true, 
            title: 'Supprimer le message', 
            message: 'Supprimer ce message définitivement ?',
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                setSelectedMessage(null);
                try {
                    await messageService.delete(id);
                    toast.success('Message supprimé');
                    setMessages(prev => prev.filter(m => m._id !== id));
                } catch (error: unknown) {
                    console.error("Erreur suppression:", error);
                    toast.error('Erreur lors de la suppression');
                }
            }
        });
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    const filteredMessages = messages.filter((m) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
            m.name.toLowerCase().includes(search) || 
            m.email.toLowerCase().includes(search) || 
            m.subject.toLowerCase().includes(search);
        
        const matchesStatus = 
            statusFilter === 'all' ? true : 
            statusFilter === 'unread' ? !m.isRead : m.isRead;
            
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Messages de contact</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {unreadCount > 0 ? (
                            <span className="text-[#023047] font-semibold">{unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</span>
                        ) : (
                            `${messages.length} message${messages.length > 1 ? 's' : ''} au total`
                        )}
                    </p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom, email ou sujet..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#023047]/20 focus:border-[#023047]" 
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {(['all', 'unread', 'read'] as const).map((status) => (
                        <button 
                            key={status} 
                            onClick={() => setStatusFilter(status)} 
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 md:flex-none ${
                                statusFilter === status 
                                    ? 'bg-[#023047] text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {status === 'all' ? 'Tous' : status === 'unread' ? 'Non lus' : 'Lus'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste des messages */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#46c2c5]" />
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Aucun message trouvé</h3>
                    <p className="text-gray-500 mt-1">Votre boîte de réception est vide.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[5%]"></th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">Expéditeur</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Sujet</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[15%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMessages.map((msg) => (
                                    <tr 
                                        key={msg._id} 
                                        className={`hover:bg-gray-50/50 transition-colors ${!msg.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            {msg.isRead ? (
                                                <MailOpen className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#023047] mx-auto"></div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`text-sm ${!msg.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                {msg.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{msg.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`text-sm ${!msg.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {msg.subject}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{msg.message}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-500">
                                                {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedMessage(msg)} 
                                                    className="p-2 text-gray-500 hover:text-[#023047] hover:bg-[#023047]/5 rounded-lg transition-colors"
                                                    title="Voir le message"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(msg._id)} 
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

            {/* Modale de détail */}
            {selectedMessage && (
                <MessageDetailModal 
                    message={selectedMessage} 
                    onClose={() => setSelectedMessage(null)} 
                    onMarkAsRead={() => handleMarkAsRead(selectedMessage._id)}
                    onDelete={() => handleDelete(selectedMessage._id)}
                />
            )}

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

export default MessagesPage;