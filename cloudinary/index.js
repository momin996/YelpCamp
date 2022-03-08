import pkg from "cloudinary"
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from "dotenv";

config();

const cloudinary = pkg.v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECERET
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Yelpcamp",
        allowedFormats: ["png", "jpeg", "jpg"]
    }
});

export default cloudinary;