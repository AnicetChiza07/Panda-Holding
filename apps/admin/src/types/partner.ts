import { z } from 'zod';

export interface Partner {
    _id: string;
    name: string;
    logo: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const partnerSchema = z.object({
    name: z.string().min(1, 'Le nom du partenaire est requis'),
    logo: z.string().min(1, 'Le logo est requis'),
    isActive: z.boolean(),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;