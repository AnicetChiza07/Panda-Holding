// src/types/user.ts
import { z } from 'zod';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor';
    avatar?: string;
}

export const profileSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Format d\'email invalide'),
    avatar: z.string().optional(),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer le nouveau mot de passe'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;