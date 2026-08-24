import type { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export interface Article {
    _id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: JSONContent;
    image: string;
    gallery: string[];
    tags: string[];
    author: string;
    authorInitials: string;
    date: string;
    readTime: string;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateArticleDTO {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: JSONContent;
    image: string;
    gallery: string[];
    tags: string[];
    author: string;
    authorInitials: string;
    date: string;
    readTime: string;
    isFeatured: boolean;
    isActive: boolean;
}

export const articleSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    slug: z.string().min(1, 'Le slug est requis'),
    category: z.string().min(1, 'La catégorie est requise'),
    excerpt: z.string().min(1, 'Le résumé est requis'),
    content: z.any(), // Sera validé comme JSONContent par le formulaire
    image: z.string().min(1, 'L\'image de couverture est requise'),
    gallery: z.array(z.string()),
    tags: z.array(z.string()),
    author: z.string().min(1, 'Le nom de l\'auteur est requis'),
    authorInitials: z.string().min(1, 'Les initiales sont requises'),
    date: z.string().min(1, 'La date est requise'),
    readTime: z.string().min(1, 'Le temps de lecture est requis'),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;