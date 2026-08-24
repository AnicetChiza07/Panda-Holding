import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    slug: string;
    category: string;
    location: string;
    shortDescription: string;
    longDescription: any; // ✅ Changé en 'any' pour accepter le JSON de Tiptap
    image: string;
    gallery: string[];
    isActive: boolean;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: [true, 'Le titre du projet est requis'], trim: true },
        slug: { 
            type: String, 
            required: [true, 'Le slug est requis'], 
            unique: true, 
            lowercase: true,
            trim: true 
        },
        category: { type: String, required: [true, 'La catégorie est requise'], trim: true },
        location: { type: String, required: [true, 'Le lieu est requis'], trim: true },
        shortDescription: { type: String, required: [true, 'La description courte est requise'], trim: true },
        
        // ✅ Accepte le JSON complet de Tiptap sans casser la validation
        longDescription: { type: Schema.Types.Mixed, default: { type: 'doc', content: [] } }, 
        
        image: { type: String, required: [true, 'L\'image de couverture est requise'] },
        gallery: [{ type: String, default: '' }], // URLs des images de la galerie
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

ProjectSchema.index({ slug: 1, category: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);