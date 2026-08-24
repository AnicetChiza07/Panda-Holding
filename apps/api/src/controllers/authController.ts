import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir un email et un mot de passe'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Compte désactivé'
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET as string,
            { 
                expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
            }
        );

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

export const setupAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Un administrateur existe déjà'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Administrateur créé avec succès',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};