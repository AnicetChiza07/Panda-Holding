import mongoose, { Schema, Document } from 'mongoose';

export interface ICarouselSlide extends Document {
    image: string;
    title?: string;
    description?: string;
    order: number;
    isActive: boolean;
}

const CarouselSlideSchema = new Schema<ICarouselSlide>({
    image: { 
        type: String, 
        required: [true, 'L\'image est requise'], 
        trim: true // ✅ Ajouté pour nettoyer les URLs
    },
    title: { 
        type: String, 
        default: '', 
        trim: true 
    },
    description: { 
        type: String, 
        default: '', 
        trim: true 
    },
    order: { 
        type: Number, 
        default: 0 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

CarouselSlideSchema.index({ order: 1 });

export const CarouselSlide = mongoose.model<ICarouselSlide>('CarouselSlide', CarouselSlideSchema);