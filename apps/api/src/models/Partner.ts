import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
    name: string;
    logo: string;
    isActive: boolean;
}

const PartnerSchema = new Schema<IPartner>(
    {
        name: { type: String, required: [true, 'Le nom du partenaire est requis'], trim: true },
        logo: { type: String, required: [true, 'Le logo est requis'] },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export const Partner = mongoose.model<IPartner>('Partner', PartnerSchema);