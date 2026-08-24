import { Request, Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

// @desc    Récupérer le profil de l'utilisateur connecté
// @route   GET /api/users/me
// @access  Privé
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        // req.user est déjà injecté et sécurisé par le middleware 'protect'
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        console.error("Erreur getMe:", error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// @desc    Mettre à jour les informations du profil (Nom, Email, Avatar)
// @route   PUT /api/users/me
// @access  Privé
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, avatar } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Non autorisé' });
        }

        // Si l'email est modifié, vérifier qu'il n'est pas déjà pris
        if (email && email !== req.user?.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name: name || req.user?.name, email: email || req.user?.email, avatar: avatar !== undefined ? avatar : req.user?.avatar },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ success: true, message: 'Profil mis à jour avec succès', data: updatedUser });
    } catch (error) {
        console.error("Erreur updateProfile:", error);
        res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour du profil' });
    }
};

// @desc    Changer le mot de passe
// @route   PUT /api/users/change-password
// @access  Privé
export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Non autorisé' });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Veuillez fournir le mot de passe actuel et le nouveau' });
        }

        // On récupère l'utilisateur AVEC le mot de passe pour la comparaison
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Le mot de passe actuel est incorrect' });
        }

        // La mise à jour du password déclenchera le pre-save hook pour le hachage
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        console.error("Erreur changePassword:", error);
        res.status(400).json({ success: false, message: 'Erreur lors du changement de mot de passe' });
    }
};