import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User'; // Ajuste le chemin si nécessaire

// ✅ Typage strict : on définit exactement ce que contient req.user
export interface AuthRequest extends Request {
    user?: Pick<IUser, '_id' | 'name' | 'email' | 'role' | 'isActive' | 'avatar'>;
}

interface JwtPayload {
    id: string;
    role: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Non autorisé - Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
        
        // ✅ On récupère l'utilisateur sans le mot de passe
        const user = await User.findById(decoded.id).select('-password') as Pick<IUser, '_id' | 'name' | 'email' | 'role' | 'isActive' | 'avatar'> | null;
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Compte désactivé' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Erreur d'authentification:", error);
        return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Accès refusé - Permissions insuffisantes' });
        }
        next();
    };
};