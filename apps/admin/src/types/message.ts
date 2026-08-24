import { z } from 'zod';

export interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const messageSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    email: z.string().email('Email invalide'),
    subject: z.string().min(1, 'Le sujet est requis'),
    message: z.string().min(1, 'Le message est requis'),
});

export type MessageFormData = z.infer<typeof messageSchema>;