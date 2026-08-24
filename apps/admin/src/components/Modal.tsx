import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: ModalSize;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {/* ✅ Suppression de max-h-[90vh] - le modal s'adapte au contenu */}
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full md:w-[85%] overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-display font-bold text-[#023047]">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ✅ Contenu scrollable uniquement si nécessaire */}
                <div className="overflow-y-auto px-6 pt-6 pb-6 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;