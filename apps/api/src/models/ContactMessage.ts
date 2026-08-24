import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
}

const ContactMessageSchema = new Schema<IContactMessage>({
    name: { 
        type: String, 
        required: [true, 'Le nom est requis'], 
        trim: true // ✅ Nettoyage des espaces
    },
    email: { 
        type: String, 
        required: [true, 'L\'email est requis'], 
        trim: true, 
        lowercase: true, // ✅ Normalisation
        match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide'] // ✅ Validation
    },
    subject: { 
        type: String, 
        required: [true, 'Le sujet est requis'], 
        trim: true 
    },
    message: { 
        type: String, 
        required: [true, 'Le message est requis'], 
        trim: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// ✅ Index pour trier rapidement : non-lus d'abord, puis par date décroissante
ContactMessageSchema.index({ isRead: 1, createdAt: -1 });

export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);