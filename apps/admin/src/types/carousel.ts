import { z } from 'zod';

export interface CarouselSlide {
    _id: string;
    image: string;
    title: string;
    description: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const carouselSlideSchema = z.object({
    image: z.string().min(1, 'L\'image est requise'),
    title: z.string().optional(),
    description: z.string().optional(),
    order: z.number().min(0, 'L\'ordre doit être positif'),
    isActive: z.boolean(),
});

export type CarouselSlideFormData = z.infer<typeof carouselSlideSchema>;