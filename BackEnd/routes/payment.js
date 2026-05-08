/**
 * Payment Routes
 * Supports both Stripe and Razorpay payment gateways
 */

import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initialize payment gateways
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret'
});

// ============================================
// RAZORPAY INTEGRATION
// ============================================

// @route   POST /api/payment/razorpay/create
// @desc    Create Razorpay order
// @access  Private
router.post('/razorpay/create', protect, asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `glamart_${Date.now()}`,
    notes: {
      userId: req.user._id.toString()
    }
  });

  res.json({
    success: true,
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    }
  });
}));

// @route   POST /api/payment/razorpay/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/razorpay/verify', protect, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret')
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    });
  }

  const order = await Order.findById(orderId);
  if (order) {
    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.orderStatus = 'confirmed';
    order.paymentMethod = 'razorpay';
    order.paymentGateway = 'razorpay';
    await order.save();
  }

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: { orderId }
  });
}));

// @route   GET /api/payment/razorpay/key
// @desc    Get Razorpay key
// @access  Private
router.get('/razorpay/key', protect, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id'
    }
  });
}));

// ============================================
// STRIPE INTEGRATION
// ============================================

// @route   POST /api/payment/stripe/create-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/stripe/create-intent', protect, asyncHandler(async (req, res) => {
  const { amount, currency = 'inr' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: {
      userId: req.user._id.toString()
    }
  });

  res.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  });
}));

// @route   POST /api/payment/stripe/verify
// @desc    Verify Stripe payment
// @access  Private
router.post('/stripe/verify', protect, asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  const order = await Order.findById(orderId);
  if (order && paymentIntent.status === 'succeeded') {
    order.paymentStatus = 'paid';
    order.paymentId = paymentIntentId;
    order.orderStatus = 'confirmed';
    order.paymentMethod = 'stripe';
    order.paymentGateway = 'stripe';
    await order.save();
  }

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: { orderId }
  });
}));

// @route   GET /api/payment/stripe/key
// @desc    Get Stripe publishable key
// @access  Private
router.get('/stripe/key', protect, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      key: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key'
    }
  });
}));

// ============================================
// CASH ON DELIVERY
// ============================================

// @route   POST /api/payment/cod
// @desc    Create COD order
// @access  Private
router.post('/cod', protect, asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.paymentStatus = 'pending';
  order.paymentMethod = 'cod';
  order.paymentGateway = 'cod';
  order.orderStatus = 'confirmed';
  await order.save();

  res.json({
    success: true,
    data: order,
    message: 'COD order placed successfully'
  });
}));

// ============================================
// WEBHOOKS
// ============================================

// @route   POST /api/payment/webhook/stripe
// @desc    Handle Stripe webhook
// @access  Public
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  if (webhookSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Webhook signature verification failed' });
    }
  } else {
    event = JSON.parse(req.body);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { 
          paymentStatus: 'paid',
          orderStatus: 'confirmed'
        }
      );
      break;
    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentIntentId: failedIntent.id },
        { paymentStatus: 'failed' }
      );
      break;
  }

  res.json({ received: true });
}));

// ============================================
// PAYMENT STATUS
// ============================================

// @route   GET /api/payment/status/:orderId
// @desc    Get payment status
// @access  Private
router.get('/status/:orderId', protect, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.orderId, 
    user: req.user._id 
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({
    success: true,
    data: {
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentGateway: order.paymentGateway,
      paymentId: order.paymentId,
      orderStatus: order.orderStatus
    }
  });
}));

export default router;
