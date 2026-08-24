import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import type { JSONContent } from '@tiptap/react';
import type { ReactNode } from 'react';
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    Strikethrough, 
    List, 
    ListOrdered, 
    Quote, 
    Heading2, 
    Heading3, 
    Image as ImageIcon, 
    Link as LinkIcon, 
    AlignLeft, 
    AlignCenter, 
    AlignRight, 
    AlignJustify,
    Undo, 
    Redo, 
    Highlighter, 
    Loader2 
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface RichTextEditorProps {
    content: JSONContent | null;
    onChange: (content: JSONContent) => void;
    placeholder?: string;
}

interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    children: ReactNode;
    title?: string;
    disabled?: boolean;
}

const ToolbarButton = ({ onClick, isActive, children, title, disabled }: ToolbarButtonProps) => (
    <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isActive ? 'bg-[#023047] text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        title={title}
    >
        {children}
    </button>
);

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
    // ✅ useState est maintenant correctement importé
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] }, underline: false, link: false }),
            Image,
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#023047] underline' } }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Color,
            TextStyle,
            Highlight.configure({ multicolor: false }),
            Placeholder.configure({ placeholder: placeholder || 'Commencez à écrire...' }),
        ],
        content: content && content.type === 'doc' ? content : { type: 'doc', content: [] },
        onUpdate: ({ editor }) => onChange(editor.getJSON()),
    });

    if (!editor) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image valide');
            return;
        }

        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post<{ success: boolean; data: { url: string } }>('/upload/single', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Optimisation Cloudinary pour un chargement instantané
            const optimizedUrl = `${response.data.data.url}?f_auto,q_auto,w_800`;
            
            editor.chain().focus().setImage({ src: optimizedUrl }).run();
            toast.success('Image ajoutée');
        } catch (error) {
            console.error("Erreur upload Tiptap:", error);
            toast.error('Échec de l\'upload de l\'image');
        } finally {
            setIsUploadingImage(false);
            if (e.target) e.target.value = '';
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL du lien :', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#023047]/20 focus-within:border-[#023047]">
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Gras"><Bold size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italique"><Italic size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Souligné"><UnderlineIcon size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Barré"><Strikethrough size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Surligner"><Highlighter size={16} /></ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Titre 2"><Heading2 size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Titre 3"><Heading3 size={16} /></ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Liste"><List size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Liste numérotée"><ListOrdered size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Citation"><Quote size={16} /></ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Gauche"><AlignLeft size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Centrer"><AlignCenter size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Droite"><AlignRight size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justifier"><AlignJustify size={16} /></ToolbarButton>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Lien"><LinkIcon size={16} /></ToolbarButton>
                
                {/* Bouton d'upload d'image réel */}
                <label className="p-2 rounded transition-colors text-gray-600 hover:bg-gray-100 cursor-pointer" title="Insérer une image depuis l'ordinateur">
                    {isUploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                </label>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Annuler"><Undo size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rétablir"><Redo size={16} /></ToolbarButton>
            </div>
            <EditorContent editor={editor} className="tiptap" />
        </div>
    );
};

export default RichTextEditor;