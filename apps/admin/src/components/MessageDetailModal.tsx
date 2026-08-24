import { Mail, User, Tag } from 'lucide-react';
import type { ContactMessage } from '../types/message';

interface MessageDetailModalProps {
    message: ContactMessage;
    onClose: () => void;
    onMarkAsRead: () => void;
    onDelete: () => void;
}

const MessageDetailModal = ({ message, onClose, onMarkAsRead, onDelete }: MessageDetailModalProps) => {
    const formattedDate = new Date(message.createdAt).toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short'
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#023047]">{message.subject}</h2>
                        <p className="text-sm text-gray-500 mt-1">Reçu le {formattedDate}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            <User className="w-5 h-5 text-[#023047]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Expéditeur</p>
                            <p className="font-semibold text-gray-900">{message.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            <Mail className="w-5 h-5 text-[#023047]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email de réponse</p>
                            <a href={`mailto:${message.email}`} className="font-semibold text-[#023047] hover:underline">
                                {message.email}
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Contenu du message</p>
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {message.message}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-xl">
                    <button 
                        onClick={onDelete} 
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Supprimer
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Fermer
                        </button>
                        {!message.isRead && (
                            <button 
                                onClick={onMarkAsRead} 
                                className="px-4 py-2 text-sm font-semibold text-white bg-[#023047] hover:bg-[#011f2e] rounded-lg transition-all shadow-sm"
                            >
                                Marquer comme lu
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageDetailModal;