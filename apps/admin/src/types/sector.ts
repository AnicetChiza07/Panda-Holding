import { z } from 'zod';
import type { JSONContent } from '@tiptap/react';

export interface Sector {
    _id: string;
    name: string;
    slug: string;
    shortDescription: string;
    longDescription: JSONContent;
    coverImage: string;
    image: string;
    images: string[];
    category: string;
    expertises: string[];
    subSectors: string[];
    realizations: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const sectorSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    slug: z.string().min(1, 'Le slug est requis'),
    shortDescription: z.string().min(1, 'La description courte est requise'),
    longDescription: z.any(),
    coverImage: z.string().min(1, 'L\'image de couverture est requise'),
    image: z.string().optional(),
    images: z.array(z.string()),
    category: z.string().min(1, 'La catégorie est requise'),
    expertises: z.array(z.string()),
    subSectors: z.array(z.string()),
    realizations: z.array(z.string()),
    isActive: z.boolean(),
});

export type SectorFormData = z.infer<typeof sectorSchema>;