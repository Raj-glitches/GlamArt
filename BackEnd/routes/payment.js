/**
 * Payment Routes
 * Supports Razorpay, Stripe and COD
 */

import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

console.log(
  '✅ PAYMENT ROUTES LOADED'
);

/* ============================================
   ENV VARIABLES
============================================ */

const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY;

const STRIPE_PUBLISHABLE_KEY =
  process.env.STRIPE_PUBLISHABLE_KEY;

const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID;

const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET;

/* ============================================
   INITIALIZE STRIPE
============================================ */

let stripe = null;

if (STRIPE_SECRET_KEY) {

  stripe = new Stripe(
    STRIPE_SECRET_KEY
  );

  console.log(
    '✅ Stripe initialized'
  );

} else {

  console.log(
    '⚠️ STRIPE_SECRET_KEY missing'
  );
}

/* ============================================
   INITIALIZE RAZORPAY
============================================ */

let razorpayInstance =
  null;

if (
  RAZORPAY_KEY_ID &&
  RAZORPAY_KEY_SECRET
) {

  razorpayInstance =
    new Razorpay({

      key_id:
        RAZORPAY_KEY_ID,

      key_secret:
        RAZORPAY_KEY_SECRET,
    });

  console.log(
    '✅ Razorpay initialized'
  );

} else {

  console.log(
    '⚠️ Razorpay keys missing'
  );
}

/* ============================================
   GET RAZORPAY KEY
============================================ */

router.get(
  '/razorpay/key',
  protect,
  asyncHandler(
    async (req, res) => {

      if (
        !RAZORPAY_KEY_ID
      ) {

        return res
          .status(500)
          .json({

            success: false,

            message:
              'Razorpay key missing',
          });
      }

      res.json({

        success: true,

        data: {
          key:
            RAZORPAY_KEY_ID,
        },
      });
    }
  )
);

/* ============================================
   CREATE RAZORPAY ORDER
============================================ */

router.post(
  '/razorpay/create',
  protect,
  asyncHandler(
    async (req, res) => {

      if (
        !razorpayInstance
      ) {

        return res
          .status(500)
          .json({

            success: false,

            message:
              'Razorpay not configured',
          });
      }

      const {
        amount,
        currency = 'INR',
      } = req.body;

      if (!amount) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              'Amount is required',
          });
      }

      const options = {

        amount:
          Math.round(
            Number(amount) * 100
          ),

        currency,

        receipt:
          `glamart_${Date.now()}`,

        notes: {

          userId:
            req.user._id.toString(),
        },
      };

      const razorpayOrder =
        await razorpayInstance.orders.create(
          options
        );

      res.json({

        success: true,

        data: {

          orderId:
            razorpayOrder.id,

          amount:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency,
        },
      });
    }
  )
);

/* ============================================
   VERIFY RAZORPAY PAYMENT
============================================ */

router.post(
  '/razorpay/verify',
  protect,
  asyncHandler(
    async (req, res) => {

      if (
        !RAZORPAY_KEY_SECRET
      ) {

        return res
          .status(500)
          .json({

            success: false,

            message:
              'Razorpay secret missing',
          });
      }

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

        orderId,

      } = req.body;

      const generatedSignature =
        crypto
          .createHmac(
            'sha256',
            RAZORPAY_KEY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest(
            'hex'
          );

      if (
        generatedSignature !==
        razorpay_signature
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              'Invalid payment signature',
          });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              'Order not found',
          });
      }

      order.paymentStatus =
        'paid';

      order.paymentId =
        razorpay_payment_id;

      order.razorpayOrderId =
        razorpay_order_id;

      order.paymentMethod =
        'razorpay';

      order.paymentGateway =
        'razorpay';

      order.orderStatus =
        'confirmed';

      await order.save();

      res.json({

        success: true,

        message:
          'Payment verified successfully',

        data:
          order,
      });
    }
  )
);

/* ============================================
   GET STRIPE KEY
============================================ */

router.get(
  '/stripe/key',
  protect,
  asyncHandler(
    async (req, res) => {

      if (
        !STRIPE_PUBLISHABLE_KEY
      ) {

        return res
          .status(500)
          .json({

            success: false,

            message:
              'Stripe publishable key missing',
          });
      }

      res.json({

        success: true,

        data: {

          key:
            STRIPE_PUBLISHABLE_KEY,
        },
      });
    }
  )
);

/* ============================================
   CREATE STRIPE PAYMENT INTENT
============================================ */

router.post(
  '/stripe/create-intent',
  protect,
  asyncHandler(
    async (req, res) => {

      try {

        if (!stripe) {

          return res
            .status(500)
            .json({

              success: false,

              message:
                'Stripe not initialized',
            });
        }

        const {
          amount,
          currency = 'inr',
        } = req.body;

        if (
          !amount ||
          isNaN(amount)
        ) {

          return res
            .status(400)
            .json({

              success: false,

              message:
                'Invalid amount',
            });
        }

        const paymentIntent =
          await stripe.paymentIntents.create({

            amount:
              Math.round(
                Number(amount) * 100
              ),

            currency,

            payment_method_types: [
              'card',
            ],

            metadata: {

              userId:
                req.user._id.toString(),
            },
          });

        res.json({

          success: true,

          data: {

            clientSecret:
              paymentIntent.client_secret,

            paymentIntentId:
              paymentIntent.id,
          },
        });

      } catch (error) {

        console.error(
          'STRIPE PAYMENT INTENT ERROR:',
          error
        );

        res
          .status(500)
          .json({

            success: false,

            message:
              error.message ||
              'Stripe payment failed',
          });
      }
    }
  )
);

/* ============================================
   VERIFY STRIPE PAYMENT
============================================ */

router.post(
  '/stripe/verify',
  protect,
  asyncHandler(
    async (req, res) => {

      try {

        if (!stripe) {

          return res
            .status(500)
            .json({

              success: false,

              message:
                'Stripe not initialized',
            });
        }

        const {

          paymentIntentId,

          orderId,

        } = req.body;

        if (
          !paymentIntentId
        ) {

          return res
            .status(400)
            .json({

              success: false,

              message:
                'Payment Intent ID missing',
            });
        }

        const paymentIntent =
          await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

        if (
          paymentIntent.status !==
          'succeeded'
        ) {

          return res
            .status(400)
            .json({

              success: false,

              message:
                'Payment not successful',
            });
        }

        const order =
          await Order.findById(
            orderId
          );

        if (!order) {

          return res
            .status(404)
            .json({

              success: false,

              message:
                'Order not found',
            });
        }

        order.paymentStatus =
          'paid';

        order.paymentMethod =
          'stripe';

        order.paymentGateway =
          'stripe';

        order.paymentId =
          paymentIntent.id;

        order.orderStatus =
          'confirmed';

        await order.save();

        res.json({

          success: true,

          message:
            'Stripe payment verified',

          data:
            order,
        });

      } catch (error) {

        console.error(
          'STRIPE VERIFY ERROR:',
          error
        );

        res
          .status(500)
          .json({

            success: false,

            message:
              error.message ||
              'Stripe verification failed',
          });
      }
    }
  )
);

/* ============================================
   PAYMENT STATUS
============================================ */

router.get(
  '/status/:orderId',
  protect,
  asyncHandler(
    async (req, res) => {

      const order =
        await Order.findOne({

          _id:
            req.params.orderId,

          user:
            req.user._id,
        });

      if (!order) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              'Order not found',
          });
      }

      res.json({

        success: true,

        data: {

          paymentStatus:
            order.paymentStatus,

          paymentMethod:
            order.paymentMethod,

          paymentGateway:
            order.paymentGateway,

          paymentId:
            order.paymentId,

          orderStatus:
            order.orderStatus,
        },
      });
    }
  )
);

router.post(
  '/cod',
  protect,
  asyncHandler(
    async (req, res) => {

      try {

        const {
          orderId,
        } = req.body;

        if (!orderId) {

          return res
            .status(400)
            .json({

              success: false,

              message:
                'Order ID required',
            });
        }

        const order =
          await Order.findById(
            orderId
          );

        if (!order) {

          return res
            .status(404)
            .json({

              success: false,

              message:
                'Order not found',
            });
        }

        order.paymentMethod =
          'cod';

        order.paymentGateway =
          'cod';

        order.paymentStatus =
          'pending';

        order.orderStatus =
          'confirmed';

        await order.save();

        res.json({

          success: true,

          message:
            'COD order placed successfully',

          data:
            order,
        });

      } catch (error) {

        console.error(
          'COD ERROR:',
          error
        );

        res
          .status(500)
          .json({

            success: false,

            message:
              error.message ||
              'COD failed',
          });
      }
    }
  )
);

export default router;