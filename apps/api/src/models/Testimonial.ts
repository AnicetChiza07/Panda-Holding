import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    name: string;
    role: string;
    company: string;
    image: string;
    content: string;
    rating: number;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Le nom est requis'],
            trim: true,
            maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
        },
        role: {
            type: String,
            required: [true, 'Le poste est requis'],
            trim: true,
            maxlength: [100, 'Le poste ne peut pas dépasser 100 caractères']
        },
        company: {
            type: String,
            required: [true, "L'entreprise est requise"],
            trim: true,
            maxlength: [100, "L'entreprise ne peut pas dépasser 100 caractères"]
        },
        image: {
            type: String,
            required: [true, "L'image est requise"]
        },
        content: {
            type: String,
            required: [true, 'Le témoignage est requis'],
            maxlength: [500, 'Le témoignage ne peut pas dépasser 500 caractères']
        },
        rating: {
            type: Number,
            required: true,
            min: [1, 'La note minimum est 1'],
            max: [5, 'La note maximum est 5'],
            default: 5
        },
        isActive: {
            type: Boolean,
            default: true
        },
        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);