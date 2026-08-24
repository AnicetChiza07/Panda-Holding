import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {/* ✅ Modale compacte : max-w-md au lieu de full width */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-display font-bold text-[#023047]">{title}</h3>
                </div>

                {/* Content - Centré et compact */}
                <div className="px-6 py-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Icône d'alerte */}
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        
                        {/* Message */}
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Actions - Boutons côte à côte */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;