import { v2 as cloudinary, UploadStream } from 'cloudinary';
import stream from 'stream';

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `panda-holding/${folder}`,
                resource_type: 'image',
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);
        bufferStream.pipe(uploadStream);
    });
};

export const deleteFromCloudinary = (publicId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};