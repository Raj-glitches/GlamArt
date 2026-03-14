/**
 * Review Routes
 * Handles product reviews and ratings
 */

import express from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadReview } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, rating } = req.query;

  let query = { product: req.params.productId, isApproved: true };
  if (rating) {
    query.rating = Number(rating);
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const reviews = await Review.find(query)
    .populate('user', 'name avatar')
    .sort('-createdAt')
    .skip(skip)
    .limit(limitNum);

  const total = await Review.countDocuments(query);

  // Calculate rating distribution
  const allReviews = await Review.find({ product: req.params.productId, isApproved: true });
  const ratingDistribution = {
    5: allReviews.filter(r => r.rating === 5).length,
    4: allReviews.filter(r => r.rating === 4).length,
    3: allReviews.filter(r => r.rating === 3).length,
    2: allReviews.filter(r => r.rating === 2).length,
    1: allReviews.filter(r => r.rating === 1).length
  };

  res.json({
    success: true,
    data: reviews,
    ratingDistribution,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Check if user already reviewed
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId
  });

  if (existingReview) {
    return res.status(400).json({ 
      success: false, 
      message: 'You have already reviewed this product' 
    });
  }

  // Create review
  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    title,
    comment
  });

  await review.populate('user', 'name avatar');

  // Update product's review array
  product.reviews.push(review._id);
  await product.save();

  res.status(201).json({
    success: true,
    data: review
  });
}));

// @route   POST /api/reviews/:id/images
// @desc    Upload review images
// @access  Private
router.post('/:id/images', protect, uploadReview.array('images', 3), asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No images uploaded' });
  }

  const images = req.files.map(file => ({
    public_id: file.public_id,
    url: file.url
  }));

  review.images.push(...images);
  await review.save();

  res.json({
    success: true,
    data: review.images
  });
}));

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;

  await review.save();
  await review.populate('user', 'name avatar');

  res.json({
    success: true,
    data: review
  });
}));

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  // Remove from product
  await Product.updateOne(
    { _id: review.product },
    { $pull: { reviews: review._id } }
  );

  await review.deleteOne();

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
}));

// @route   PUT /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.put('/:id/helpful', protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  // Check if user already marked as helpful
  if (review.helpfulUsers.includes(req.user._id)) {
    review.helpfulUsers = review.helpfulUsers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    review.helpful -= 1;
  } else {
    review.helpfulUsers.push(req.user._id);
    review.helpful += 1;
  }

  await review.save();

  res.json({
    success: true,
    data: { helpful: review.helpful }
  });
}));

export default router;
