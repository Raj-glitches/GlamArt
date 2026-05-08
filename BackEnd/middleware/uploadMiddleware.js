/**
 * File Upload Middleware
 * Handles image uploads to Cloudinary
 */

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glamart/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
  }
});

const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glamart/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
  }
});

const reviewStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glamart/reviews',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'limit', quality: 'auto' }]
  }
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glamart/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'), false);
  }
};

// Multer upload instances
export const uploadProduct = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadCategory = multer({
  storage: categoryStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB
});

export const uploadReview = multer({
  storage: reviewStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Multiple image upload for products
export const uploadProductImages = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }
}).array('images', 5);

export default cloudinary;
