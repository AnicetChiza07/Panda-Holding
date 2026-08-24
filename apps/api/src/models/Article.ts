import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: any; // ✅ Changé en 'any' (ou Schema.Types.Mixed) pour accepter le JSON Tiptap natif
    image: string;
    gallery: string[]; // ✅ Ajouté pour la galerie d'images
    tags: string[]; // ✅ Ajouté pour le SEO et le filtrage
    author: string;
    authorInitials: string;
    date: string;
    readTime: string;
    isFeatured: boolean;
    isActive: boolean;
}

const ArticleSchema = new Schema<IArticle>(
    {
        title: { type: String, required: [true, 'Le titre est requis'], trim: true },
        slug: { 
            type: String, 
            required: [true, 'Le slug est requis'], 
            unique: true, 
            lowercase: true,
            trim: true 
        },
        category: { type: String, required: [true, 'La catégorie est requise'], trim: true },
        excerpt: { type: String, required: [true, 'Le résumé est requis'], trim: true },
        
        // ✅ Accepte le JSON complet de Tiptap sans casser la validation
        content: { type: Schema.Types.Mixed, default: { type: 'doc', content: [] } }, 
        
        image: { type: String, required: [true, 'L\'image de couverture est requise'] },
        gallery: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        
        author: { type: String, required: [true, 'Le nom de l\'auteur est requis'], trim: true },
        authorInitials: { type: String, required: [true, 'Les initiales sont requises'], trim: true, uppercase: true },
        date: { type: String, required: [true, 'La date est requise'] }, // Format 'YYYY-MM-DD'
        readTime: { type: String, required: [true, 'Le temps de lecture est requis'], trim: true }, // Ex: "5 min"
        
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

// Index pour la recherche rapide
ArticleSchema.index({ title: 'text', tags: 'text', category: 'text' });

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);