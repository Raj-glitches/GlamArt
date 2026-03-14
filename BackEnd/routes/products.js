/**
 * Product Routes
 * Handles product CRUD operations
 */

import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadProductImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort = '-createdAt',
    search,
    featured
  } = req.query;

  // Build query
  let queryObj = { isActive: true };

  if (category) {
    queryObj.category = category;
  }

  if (brand) {
    queryObj.brand = { $regex: brand, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    queryObj.sellingPrice = {};
    if (minPrice) queryObj.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) queryObj.sellingPrice.$lte = Number(maxPrice);
  }

  if (rating) {
    queryObj.ratings = { $gte: Number(rating) };
  }

  if (search) {
    queryObj.$text = { $search: search };
  }

  if (featured === 'true') {
    queryObj.isFeatured = true;
  }

  // Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(queryObj)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments(queryObj);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// @route   GET /api/products/:slug
// @desc    Get single product by slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('reviews', 'rating comment user createdAt')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({
    success: true,
    data: product
  });
}));

// @route   GET /api/products/recommendations/:productId
// @desc    Get product recommendations (AI mock collaborative filtering)
// @access  Public
router.get('/recommendations/:productId', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Mock collaborative filtering - get products from same category
  const recommendations = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true
  })
  .populate('category', 'name slug')
  .limit(4);

  // Also get some random products as fallback
  if (recommendations.length < 4) {
    const randomProducts = await Product.find({
      _id: { $nin: [product._id, ...recommendations.map(p => p._id)] },
      isActive: true
    })
    .populate('category', 'name slug')
    .limit(4 - recommendations.length);
    
    recommendations.push(...randomProducts);
  }

  res.json({
    success: true,
    data: recommendations
  });
}));

// @route   GET /api/products/user/recently-viewed
// @desc    Get recently viewed products
// @access  Private
router.get('/user/recently-viewed', protect, asyncHandler(async (req, res) => {
  const user = await req.user.populate('recentlyViewed', 'title slug images price sellingPrice ratings');
  
  res.json({
    success: true,
    data: user.recentlyViewed
  });
}));

// @route   POST /api/products
// @desc    Create a product
// @access  Admin
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const {
    title,
    description,
    brand,
    category,
    subcategory,
    price,
    discount,
    stock,
    onlineStock,
    offlineStock,
    features,
    ingredients,
    howToUse,
    skinType,
    hairType,
    concern,
    metaTitle,
    metaDescription,
    isFeatured
  } = req.body;

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const product = await Product.create({
    title,
    slug,
    description,
    brand,
    category,
    subcategory,
    price,
    discount,
    stock,
    onlineStock: onlineStock || stock,
    offlineStock: offlineStock || 0,
    features,
    ingredients,
    howToUse,
    skinType,
    hairType,
    concern,
    metaTitle,
    metaDescription,
    isFeatured
  });

  await product.populate('category', 'name slug');

  res.status(201).json({
    success: true,
    data: product
  });
}));

// @route   POST /api/products/:id/images
// @desc    Upload product images
// @access  Admin
router.post('/:id/images', protect, adminOnly, uploadProductImages, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No images uploaded' });
  }

  const images = req.files.map(file => ({
    public_id: file.public_id,
    url: file.url
  }));

  product.images.push(...images);
  await product.save();

  res.json({
    success: true,
    data: product.images
  });
}));

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Admin
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const {
    title,
    description,
    brand,
    category,
    subcategory,
    price,
    discount,
    stock,
    onlineStock,
    offlineStock,
    features,
    ingredients,
    howToUse,
    skinType,
    hairType,
    concern,
    metaTitle,
    metaDescription,
    isFeatured,
    isActive
  } = req.body;

  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Update fields
  if (title) {
    product.title = title;
    product.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (description) product.description = description;
  if (brand) product.brand = brand;
  if (category) product.category = category;
  if (subcategory) product.subcategory = subcategory;
  if (price !== undefined) product.price = price;
  if (discount !== undefined) product.discount = discount;
  if (stock !== undefined) product.stock = stock;
  if (onlineStock !== undefined) product.onlineStock = onlineStock;
  if (offlineStock !== undefined) product.offlineStock = offlineStock;
  if (features) product.features = features;
  if (ingredients) product.ingredients = ingredients;
  if (howToUse) product.howToUse = howToUse;
  if (skinType) product.skinType = skinType;
  if (hairType) product.hairType = hairType;
  if (concern) product.concern = concern;
  if (metaTitle) product.metaTitle = metaTitle;
  if (metaDescription) product.metaDescription = metaDescription;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();
  await product.populate('category', 'name slug');

  res.json({
    success: true,
    data: product
  });
}));

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Admin
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Soft delete - just set isActive to false
  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
}));

// @route   PUT /api/products/:id/stock
// @desc    Update product stock
// @access  Admin
router.put('/:id/stock', protect, adminOnly, asyncHandler(async (req, res) => {
  const { onlineStock, offlineStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (onlineStock !== undefined) product.onlineStock = onlineStock;
  if (offlineStock !== undefined) product.offlineStock = offlineStock;
  
  // Calculate total stock
  product.stock = product.onlineStock + product.offlineStock;

  await product.save();

  res.json({
    success: true,
    data: product
  });
}));

// @route   GET /api/products/check-stock
// @desc    Check product availability by pincode
// @access  Public
router.get('/check-stock', asyncHandler(async (req, res) => {
  const { productId, pincode } = req.query;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Mock stock check - in production, integrate with pincode service
  const availablePincodes = ['110001', '110005', '400001', '400002', '560001', '560002', '600001', '600002'];
  const isPincodeServicable = availablePincodes.some(p => pincode?.startsWith(p.slice(0, 2)));

  res.json({
    success: true,
    data: {
      productId: product._id,
      productName: product.title,
      onlineStock: product.onlineStock,
      offlineStock: product.offlineStock,
      totalStock: product.stock,
      isAvailable: product.stock > 0,
      isPincodeServicable: pincode ? isPincodeServicable : null,
      estimatedDelivery: pincode ? '2-5 business days' : null
    }
  });
}));

export default router;
