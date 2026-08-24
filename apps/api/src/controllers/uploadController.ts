import { Request, Response } from 'express';
import { uploadToCloudinary } from '../utils/cloudinary';

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const folder = req.body.folder || 'general';

        const result = await uploadToCloudinary(req.file.buffer, folder);

        res.status(200).json({
            success: true,
            message: 'Image uploadée avec succès',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const folder = req.body.folder || 'general';
        const files = req.files as Express.Multer.File[];

        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, folder));
        const results = await Promise.all(uploadPromises);

        const uploadedImages = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height
        }));

        res.status(200).json({
            success: true,
            message: 'Images uploadées avec succès',
            count: uploadedImages.length,
            data: uploadedImages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};