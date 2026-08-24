import { z } from 'zod';
import type { JSONContent } from '@tiptap/react';

export interface Project {
    _id: string;
    title: string;
    slug: string;
    category: string;
    location: string;
    shortDescription: string;
    longDescription: JSONContent;
    image: string;
    gallery: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const projectSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    slug: z.string().min(1, 'Le slug est requis'),
    category: z.string().min(1, 'La catégorie est requise'),
    location: z.string().min(1, 'Le lieu est requis'),
    shortDescription: z.string().min(1, 'La description courte est requise'),
    longDescription: z.any(), // Pour Tiptap
    image: z.string().min(1, 'L\'image de couverture est requise'),
    gallery: z.array(z.string()),
    isActive: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;