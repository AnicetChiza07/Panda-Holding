import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        await mongoose.connect(mongoUri);

        console.log('✅ MongoDB connected successfully to:', mongoose.connection.name);
        
        // Gestion des événements de connexion
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};