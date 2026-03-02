/**
 * Order Routes
 * Handles order management
 */

import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/errorMiddleware.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get current user orders
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { user: req.user._id };
  if (status) {
    query.orderStatus = status;
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find(query)
    .populate('orderItems.product', 'title images')
    .populate('pickupStore', 'name address')
    .sort('-createdAt')
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate('orderItems.product', 'title images')
    .populate('pickupStore', 'name address phone');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({
    success: true,
    data: order
  });
}));

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    deliveryMethod,
    pickupStore,
    couponCode
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  // Calculate prices
  let itemsPrice = 0;
  const orderItemsData = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: `Product not found: ${item.product}` 
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient stock for ${product.title}` 
      });
    }

    const itemPrice = product.sellingPrice * item.quantity;
    itemsPrice += itemPrice;

    orderItemsData.push({
      product: product._id,
      name: product.title,
      image: product.images[0]?.url || '',
      price: product.sellingPrice,
      quantity: item.quantity,
      discount: product.discount
    });

    // Reduce stock
    product.stock -= item.quantity;
    product.onlineStock = Math.max(0, product.onlineStock - item.quantity);
    await product.save();
  }

  // Calculate discount
  let discountPrice = 0;
  if (couponCode) {
    const Coupon = (await import('../models/Coupon.js')).default;
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    
    if (coupon && coupon.isValid()) {
      discountPrice = coupon.calculateDiscount(itemsPrice);
    }
  }

  // Calculate tax (18% GST)
  const taxPrice = Math.round((itemsPrice - discountPrice) * 0.18);
  
  // Calculate shipping (free above ₹500)
  const shippingPrice = itemsPrice - discountPrice >= 500 ? 0 : 49;

  const totalPrice = itemsPrice - discountPrice + taxPrice + shippingPrice;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems: orderItemsData,
    shippingAddress,
    paymentMethod,
    deliveryMethod,
    pickupStore,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountPrice,
    totalPrice
  });

  await order.populate('orderItems.product', 'title images');
  await order.populate('pickupStore', 'name address');

  res.status(201).json({
    success: true,
    data: order
  });
}));

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Order cannot be cancelled at this stage' 
    });
  }

  // Restore stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      product.onlineStock += item.quantity;
      await product.save();
    }
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = Date.now();
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  await order.save();

  res.json({
    success: true,
    data: order,
    message: 'Order cancelled successfully'
  });
}));

// ============ ADMIN ROUTES ============

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Admin
router.get('/admin/all', protect, adminOnly, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, paymentStatus, search } = req.query;

  let query = {};
  
  if (status) query.orderStatus = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (search) {
    query.$or = [
      { _id: search },
      { 'shippingAddress.name': { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .populate('orderItems.product', 'title images')
    .populate('pickupStore', 'name')
    .sort('-createdAt')
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// @route   GET /api/orders/admin/stats
// @desc    Get order statistics (admin)
// @access  Admin
router.get('/admin/stats', protect, adminOnly, asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateQuery = {};
  if (startDate || endDate) {
    dateQuery.createdAt = {};
    if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
    if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(dateQuery);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;

  // Daily orders for chart
  const dailyOrders = orders.reduce((acc, order) => {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { orders: 0, revenue: 0 };
    }
    acc[date].orders += 1;
    if (order.paymentStatus === 'paid') {
      acc[date].revenue += order.totalPrice;
    }
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      dailyOrders: Object.entries(dailyOrders).map(([date, data]) => ({
        date,
        ...data
      }))
    }
  });
}));

// @route   PUT /api/orders/admin/:id/status
// @desc    Update order status (admin)
// @access  Admin
router.put('/admin/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const { orderStatus, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.orderStatus = orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  if (orderStatus === 'shipped') {
    order.shippedAt = Date.now();
  } else if (orderStatus === 'delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();
  await order.populate('user', 'name email');
  await order.populate('orderItems.product', 'title images');

  res.json({
    success: true,
    data: order
  });
}));

// @route   PUT /api/orders/admin/:id/payment
// @desc    Update payment status (admin)
// @access  Admin
router.put('/admin/:id/payment', protect, adminOnly, asyncHandler(async (req, res) => {
  const { paymentStatus, paymentId } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.paymentStatus = paymentStatus;
  if (paymentId) order.paymentId = paymentId;

  await order.save();

  res.json({
    success: true,
    data: order
  });
}));

export default router;
