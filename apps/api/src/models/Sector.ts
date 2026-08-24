import mongoose, { Schema, Document } from 'mongoose';

export interface ISector extends Document {
    name: string;
    slug: string;
    shortDescription: string;
    longDescription: any; // 'any' ou 'Mixed' ici pour accepter à la fois les tableaux et les objets Tiptap sans planter
    coverImage: string;
    image: string;
    images: string[];
    category: string;
    expertises: string[];
    subSectors: string[];
    realizations: string[];
    isActive: boolean;
}

const sectorSchema = new Schema<ISector>({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, required: true, trim: true },
    
    // ✅ Schema.Types.Mixed est la solution la plus sûre pour le JSON de Tiptap
    // Il accepte { type: 'doc', content: [...] } OU [{ type: 'paragraph', ... }]
    longDescription: { type: Schema.Types.Mixed, default: [] }, 
    
    // ✅ default: '' évite que les anciens secteurs sans coverImage fassent planter le GET
    coverImage: { type: String, default: '' }, 
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    
    category: { type: String, required: true, trim: true },
    expertises: { type: [String], default: [] },
    subSectors: { type: [String], default: [] },
    realizations: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
}, { 
    timestamps: true,
    // ✅ Cette option empêche Mongoose de supprimer les champs inconnus et évite les erreurs de validation strictes
    strict: false 
});

// Index pour la recherche rapide
sectorSchema.index({ name: 'text', category: 'text' });

export const Sector = mongoose.model<ISector>('Sector', sectorSchema);