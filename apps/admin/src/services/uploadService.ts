import api from './api';

export const uploadService = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file); // ⚠️ Change 'file' en 'image' si ton backend l'attend ainsi
        
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    }
};