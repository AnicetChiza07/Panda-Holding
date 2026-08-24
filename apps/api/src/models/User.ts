import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: 'admin' | 'editor';
    isActive: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: [true, 'Le nom est requis'], trim: true },
        email: { 
            type: String, 
            required: [true, 'L\'email est requis'], 
            unique: true, 
            lowercase: true,
            trim: true 
        },
        password: { 
            type: String, 
            required: [true, 'Le mot de passe est requis'],
            minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
        },
        avatar: { type: String, default: '' },
        role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (this: IUser) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);