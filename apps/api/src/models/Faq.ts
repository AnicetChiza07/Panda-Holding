import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq extends Document {
    question: string;
    answer: any; // JSONContent pour Tiptap
    order: number;
    isActive: boolean;
}

const FaqSchema = new Schema<IFaq>(
    {
        question: { 
            type: String, 
            required: [true, 'La question est requise'], 
            trim: true 
        },
        answer: { 
            type: Schema.Types.Mixed, 
            // ✅ Validation personnalisée : vérifie que ce n'est pas null/undefined
            required: [true, 'La réponse est requise'],
            validate: {
                validator: function(v: any) {
                    // Accepte un objet avec 'type' et 'content', ou un tableau
                    if (!v) return false;
                    if (typeof v === 'object') return true;
                    return false;
                },
                message: 'Le format de la réponse est invalide'
            }
        },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

FaqSchema.index({ order: 1 });

export const Faq = mongoose.model<IFaq>('Faq', FaqSchema);