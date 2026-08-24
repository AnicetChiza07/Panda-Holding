import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDatabase } from './config/database';
import { configureCloudinary } from './config/cloudinary';
import apiRoutes from './routes';

// Charger les variables d'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES DE SÉCURITÉ & PERFORMANCE
// ==========================================

// 1. Helmet : Sécurise les en-têtes HTTP
app.use(helmet());

// 2. CORS : Autorise les requêtes du frontend et de l'admin
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Compression : Compresse les réponses pour améliorer la vitesse
app.use(compression());

// 4. Body Parsers : Permet de lire le JSON et les formulaires
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Rate Limiting : Protection contre les attaques par force brute / DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite à 100 requêtes par IP par fenêtre
    message: 'Trop de requêtes provenant de cette IP, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// 6. Morgan : Logs des requêtes HTTP en développement
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ==========================================
// ROUTES API
// ==========================================
app.use('/api', apiRoutes);

// ==========================================
// ROUTES DE BASE (Health Check)
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Panda Holding API is running smoothly',
        environment: process.env.NODE_ENV 
    });
});

// ==========================================
// GESTION DES ERREURS 404
// ==========================================
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} non trouvée`
    });
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================
const startServer = async () => {
    try {
        await connectDatabase();
        configureCloudinary();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();