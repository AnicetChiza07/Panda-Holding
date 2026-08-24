import { z } from 'zod';
import type { JSONContent } from '@tiptap/react';

export interface Faq {
    _id: string;
    question: string;
    answer: JSONContent;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const faqSchema = z.object({
    question: z.string().min(1, 'La question est requise'),
    answer: z.any(), // Pour Tiptap
    order: z.number().min(0, 'L\'ordre doit être positif'),
    isActive: z.boolean(),
});

export type FaqFormData = z.infer<typeof faqSchema>;