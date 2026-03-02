/**
 * Payment Routes
 * Handles Razorpay payment integration
 */

import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/errorMiddleware.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100), // Convert to paise
    currency: 'INR',
    receipt: order._id.toString(),
    notes: {
      orderId: order._id.toString(),
      userId: req.user._id.toString()
    }
  });

  // Save razorpay order ID to order
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    success: true,
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'test_key_id'
    }
  });
}));

// @route   POST /api/payment/verify
// @desc    Verify payment signature
// @access  Private
router.post('/verify', protect, asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_key_secret')
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    // Update order payment status to failed
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'failed'
    });

    return res.status(400).json({ 
      success: false, 
      message: 'Invalid payment signature' 
    });
  }

  // Update order
  const order = await Order.findById(orderId);
  if (order) {
    order.paymentStatus = 'paid';
    order.paymentId = razorpayPaymentId;
    order.orderStatus = 'confirmed';
    await order.save();
  }

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: { orderId, paymentId: razorpayPaymentId }
  });
}));

// @route   POST /api/payment/webhook
// @desc    Handle Razorpay webhook
// @access  Public (verified by webhook signature)
router.post('/webhook', asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  // Verify webhook signature
  if (webhookSecret) {
    const signature = req.headers['x-razorpay-signature'];
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== generatedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }
  }

  const event = req.body;
  const payment = event.payload.payment.entity;

  // Handle different events
  switch (event.event) {
    case 'payment.captured':
      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { 
          paymentStatus: 'paid',
          paymentId: payment.id,
          orderStatus: 'confirmed'
        }
      );
      break;

    case 'payment.failed':
      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { paymentStatus: 'failed' }
      );
      break;

    default:
      console.log('Unhandled webhook event:', event.event);
  }

  res.json({ received: true });
}));

// @route   POST /api/payment/cod
// @desc    Create COD order
// @access  Private
router.post('/cod', protect, asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Update payment status for COD
  order.paymentStatus = 'pending';
  order.paymentMethod = 'cod';
  order.orderStatus = 'confirmed';
  await order.save();

  res.json({
    success: true,
    data: order,
    message: 'COD order placed successfully'
  });
}));

export default router;
