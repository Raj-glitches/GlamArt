/**
 * Store Routes
 * Handles physical store data for omnichannel
 */

import express from 'express';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/errorMiddleware.js';

const router = express.Router();

// @route   GET /api/stores
// @desc    Get all stores
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { city, state } = req.query;

  let query = { isActive: true };
  if (city) {
    query['address.city'] = { $regex: city, $options: 'i' };
  }
  if (state) {
    query['address.state'] = { $regex: state, $options: 'i' };
  }

  const stores = await Store.find(query).sort('name');

  res.json({
    success: true,
    data: stores
  });
}));

// @route   GET /api/stores/nearby
// @desc    Get nearby stores by coordinates
// @access  Public
router.get('/nearby', asyncHandler(async (req, res) => {
  const { lat, lng, radius = 50 } = req.query; // radius in km

  if (!lat || !lng) {
    return res.status(400).json({ 
      success: false, 
      message: 'Latitude and longitude are required' 
    });
  }

  const stores = await Store.find({
    isActive: true,
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
      }
    }
  });

  res.json({
    success: true,
    data: stores
  });
}));

// @route   GET /api/stores/:id
// @desc    Get single store
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  res.json({
    success: true,
    data: store
  });
}));

// @route   GET /api/stores/:id/products
// @desc    Get products available at store
// @access  Public
router.get('/:id/products', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const store = await Store.findById(req.params.id);
  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  // Find products with stock at this store
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find({
    'storeAvailability.storeId': req.params.id,
    isActive: true
  })
  .populate('category', 'name slug')
  .skip(skip)
  .limit(limitNum);

  const total = await Product.countDocuments({
    'storeAvailability.storeId': req.params.id,
    isActive: true
  });

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

// @route   GET /api/stores/check-pincode/:pincode
// @desc    Check if pincode is serviceable by stores
// @access  Public
router.get('/check-pincode/:pincode', asyncHandler(async (req, res) => {
  const { pincode } = req.params;

  // Mock pincode serviceability
  const serviceablePincodes = {
    '110': 'Delhi',
    '400': 'Mumbai',
    '560': 'Bangalore',
    '600': 'Chennai',
    '500': 'Hyderabad',
    '700': 'Kolkata'
  };

  const prefix = pincode.slice(0, 3);
  const isServiceable = serviceablePincodes[prefix];

  if (isServiceable) {
    // Find stores in that city
    const stores = await Store.find({
      isActive: true,
      'address.pincode': { $regex: `^${prefix}` }
    });

    res.json({
      success: true,
      data: {
        serviceable: true,
        city: isServiceable,
        stores: stores.map(s => ({
          id: s._id,
          name: s.name,
          address: s.address
        }))
      }
    });
  } else {
    res.json({
      success: true,
      data: {
        serviceable: false,
        message: 'Sorry, we do not have stores in your area'
      }
    });
  }
}));

// ============ ADMIN ROUTES ============

// @route   POST /api/stores
// @desc    Create a store
// @access  Admin
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const store = await Store.create(req.body);

  res.status(201).json({
    success: true,
    data: store
  });
}));

// @route   PUT /api/stores/:id
// @desc    Update a store
// @access  Admin
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const store = await Store.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  res.json({
    success: true,
    data: store
  });
}));

// @route   DELETE /api/stores/:id
// @desc    Delete a store
// @access  Admin
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  store.isActive = false;
  await store.save();

  res.json({
    success: true,
    message: 'Store deleted successfully'
  });
}));

export default router;
