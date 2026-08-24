import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

const ImageUploader = ({ value, onChange, label }: ImageUploaderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image valide');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('L\'image ne doit pas dépasser 5 Mo');
            return;
        }

        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post<{ success: boolean; data: { url: string } }>('/upload/single', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const optimizedUrl = `${response.data.data.url}?f_auto,q_auto,w_800`;
            onChange(optimizedUrl);
            setPreview(optimizedUrl);
            toast.success('Image ajoutée');
        } catch (error: unknown) {
            console.error("Erreur upload:", error);
            toast.error('Échec de l\'upload');
            setPreview(value);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleRemove = () => {
        onChange('');
        setPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full h-full">
            {label && <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>}
            
            <div className="w-full h-full">
                {preview ? (
                    <div className="relative group w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img 
                            src={preview} 
                            alt="Aperçu" 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-gray-100 hover:text-[#023047] transition-colors shadow-lg" title="Changer">
                                <Upload size={18} />
                            </button>
                            <button type="button" onClick={handleRemove} className="p-2.5 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg" title="Supprimer">
                                <X size={18} />
                            </button>
                        </div>
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={
                            isDragging 
                                ? "relative cursor-pointer w-full h-full border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 flex flex-col items-center justify-center border-[#46c2c5] bg-[#46c2c5]/5" 
                                : "relative cursor-pointer w-full h-full border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 flex flex-col items-center justify-center border-gray-300 hover:border-[#023047]/50 hover:bg-gray-50"
                        }
                        style={{ opacity: isUploading ? 0.5 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-[#023047] mb-2" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-xs text-gray-600 font-medium">{isUploading ? 'Upload...' : 'Glisser ou cliquer'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;