/**
 * Category Routes
 * Handles category CRUD operations
 */

import express from 'express';
import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadCategory } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('parentCategory', 'name slug')
    .sort('order');

  res.json({
    success: true,
    data: categories
  });
}));

// @route   GET /api/categories/:slug
// @desc    Get single category by slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    .populate('parentCategory', 'name slug');

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.json({
    success: true,
    data: category
  });
}));

// @route   POST /api/categories
// @desc    Create a category
// @access  Admin
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { name, description, parentCategory, order } = req.body;

  // Generate slug
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const category = await Category.create({
    name,
    slug,
    description,
    parentCategory,
    order
  });

  res.status(201).json({
    success: true,
    data: category
  });
}));

// @route   POST /api/categories/:id/image
// @desc    Upload category image
// @access  Admin
router.post('/:id/image', protect, adminOnly, uploadCategory.single('image'), asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }

  category.image = {
    public_id: req.file.public_id,
    url: req.file.url
  };

  await category.save();

  res.json({
    success: true,
    data: category.image
  });
}));

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Admin
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const { name, description, parentCategory, order, isActive } = req.body;

  let category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  if (name) {
    category.name = name;
    category.slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (description) category.description = description;
  if (parentCategory) category.parentCategory = parentCategory;
  if (order !== undefined) category.order = order;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();

  res.json({
    success: true,
    data: category
  });
}));

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Admin
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  // Soft delete
  category.isActive = false;
  await category.save();

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
}));

export default router;
