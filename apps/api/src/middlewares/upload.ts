import multer from 'multer';

// Configuration de Multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

// Filtre pour n'accepter que les images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB max
    }
});