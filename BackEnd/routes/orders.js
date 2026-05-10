/**
 * Order Routes
 * Handles order management
 */

import express from 'express';
import asyncHandler from 'express-async-handler';

import Order from '../models/Order.js';
import Product from '../models/Product.js';

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================================
// HELPER FUNCTIONS
// ============================================

const calculateTax = (
  amount
) => {
  return Math.round(
    Number(amount || 0) *
      0.18
  );
};

const calculateShipping =
  (amount) => {
    return amount >= 500
      ? 0
      : 49;
  };

// ============================================
// GET USER ORDERS
// ============================================

router.get(
  '/',
  protect,
  asyncHandler(
    async (req, res) => {
      const {
        page = 1,
        limit = 10,
        status,
      } = req.query;

      const query =
        req.user.role ===
        'admin'
          ? {}
          : {
              user:
                req.user._id,
            };

      if (status) {
        query.orderStatus =
          status;
      }

      const pageNum =
        Number(page);

      const limitNum =
        Number(limit);

      const skip =
        (pageNum - 1) *
        limitNum;

      const orders =
        await Order.find(
          query
        )
          .populate(
            'user',
            'name email'
          )
          .populate(
            'orderItems.product',
            'title images'
          )
          .populate(
            'pickupStore',
            'name address'
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limitNum);

      const total =
        await Order.countDocuments(
          query
        );

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages:
            Math.ceil(
              total /
                limitNum
            ),
        },
      });
    }
  )
);

// ============================================
// GET SINGLE ORDER
// ============================================

router.get(
  '/:id',
  protect,
  asyncHandler(
    async (req, res) => {
      const query =
        req.user.role ===
        'admin'
          ? {
              _id:
                req.params.id,
            }
          : {
              _id:
                req.params.id,
              user:
                req.user._id,
            };

      const order =
        await Order.findOne(
          query
        )
          .populate(
            'user',
            'name email phone'
          )
          .populate(
            'orderItems.product',
            'title images'
          )
          .populate(
            'pickupStore',
            'name address phone'
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

      res.json({
        success: true,
        data: order,
      });
    }
  )
);

// ============================================
// GET ORDER STATUS
// ============================================

router.get(
  '/:id/status',
  protect,
  asyncHandler(
    async (req, res) => {
      const query =
        req.user.role ===
        'admin'
          ? {
              _id:
                req.params.id,
            }
          : {
              _id:
                req.params.id,
              user:
                req.user._id,
            };

      const order =
        await Order.findOne(
          query
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

      res.json({
        success: true,
        data: {
          orderStatus:
            order.orderStatus,
          paymentStatus:
            order.paymentStatus,
          paymentMethod:
            order.paymentMethod,
          paymentId:
            order.paymentId,
          trackingNumber:
            order.trackingNumber,
        },
      });
    }
  )
);

// ============================================
// UPDATE ORDER STATUS
// ============================================

router.put(
  '/:id/status',
  protect,
  asyncHandler(
    async (req, res) => {
      const {
        orderStatus,
        trackingNumber,
      } = req.body;

      const isAdmin =
        req.user.role ===
        'admin';

      const query =
        isAdmin
          ? {
              _id:
                req.params.id,
            }
          : {
              _id:
                req.params.id,
              user:
                req.user._id,
            };

      const order =
        await Order.findOne(
          query
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

      // USER CAN ONLY READ STATUS
      if (!isAdmin) {
        return res.json({
          success: true,
          data: {
            orderStatus:
              order.orderStatus,
            paymentStatus:
              order.paymentStatus,
          },
        });
      }

      // ADMIN UPDATE

      if (orderStatus) {
        order.orderStatus =
          orderStatus;
      }

      if (
        trackingNumber
      ) {
        order.trackingNumber =
          trackingNumber;
      }

      if (
        orderStatus ===
        'shipped'
      ) {
        order.shippedAt =
          new Date();
      }

      if (
        orderStatus ===
        'delivered'
      ) {
        order.deliveredAt =
          new Date();

        order.paymentStatus =
          order.paymentMethod ===
          'cod'
            ? 'paid'
            : order.paymentStatus;
      }

      await order.save();

      res.json({
        success: true,
        message:
          'Order status updated',
        data: order,
      });
    }
  )
);

// ============================================
// CREATE ORDER
// ============================================

router.post(
  '/',
  protect,
  asyncHandler(
    async (req, res) => {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        deliveryMethod,
        pickupStore,
        couponCode,
      } = req.body;

      // VALIDATION

      if (
        !Array.isArray(
          orderItems
        ) ||
        orderItems.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'No order items',
          });
      }

      // ============================================
      // BUILD ORDER ITEMS
      // ============================================

      let itemsPrice = 0;

      const validatedItems =
        [];

      for (const item of orderItems) {
        const product =
          await Product.findById(
            item.product
          );

        if (!product) {
          return res
            .status(404)
            .json({
              success:
                false,
              message: `Product not found: ${item.product}`,
            });
        }

        const quantity =
          Number(
            item.quantity
          );

        if (
          product.stock <
          quantity
        ) {
          return res
            .status(400)
            .json({
              success:
                false,
              message: `${product.title} is out of stock`,
            });
        }

        const price =
          Number(
            product.sellingPrice ||
              product.price ||
              0
          );

        itemsPrice +=
          price * quantity;

        validatedItems.push(
          {
            product:
              product._id,

            name:
              product.title,

            image:
              product
                ?.images?.[0]
                ?.url || '',

            price,

            quantity,

            discount:
              product.discount ||
              0,
          }
        );
      }

      // ============================================
      // COUPON
      // ============================================

      let discountPrice = 0;

      if (couponCode) {
        try {
          const Coupon =
            (
              await import(
                '../models/Coupon.js'
              )
            ).default;

          const coupon =
            await Coupon.findOne(
              {
                code: couponCode.toUpperCase(),
              }
            );

          if (
            coupon &&
            coupon.isValid()
          ) {
            discountPrice =
              coupon.calculateDiscount(
                itemsPrice
              );
          }
        } catch (
          error
        ) {
          console.log(
            'Coupon model not found'
          );
        }
      }

      // ============================================
      // PRICES
      // ============================================

      const taxableAmount =
        itemsPrice -
        discountPrice;

      const taxPrice =
        calculateTax(
          taxableAmount
        );

      const shippingPrice =
        calculateShipping(
          taxableAmount
        );

      const totalPrice =
        taxableAmount +
        taxPrice +
        shippingPrice;

      // ============================================
      // CREATE ORDER
      // ============================================

      const order =
        await Order.create({
          user:
            req.user._id,

          orderItems:
            validatedItems,

          shippingAddress,

          paymentMethod:
            paymentMethod ||
            'razorpay',

          paymentGateway:
            paymentMethod ||
            'razorpay',

          deliveryMethod:
            deliveryMethod ||
            'home_delivery',

          pickupStore:
            pickupStore ||
            null,

          itemsPrice,

          taxPrice,

          shippingPrice,

          discountPrice,

          totalPrice,

          paymentStatus:
            paymentMethod ===
            'cod'
              ? 'pending'
              : 'pending',

          orderStatus:
            'pending',
        });

      // ============================================
      // REDUCE STOCK
      // ============================================

      for (const item of validatedItems) {
        const product =
          await Product.findById(
            item.product
          );

        if (product) {
          product.stock -=
            item.quantity;

          if (
            typeof product.onlineStock ===
            'number'
          ) {
            product.onlineStock =
              Math.max(
                0,
                product.onlineStock -
                  item.quantity
              );
          }

          await product.save();
        }
      }

      // ============================================
      // POPULATE
      // ============================================

      await order.populate(
        'orderItems.product',
        'title images'
      );

      await order.populate(
        'pickupStore',
        'name address'
      );

      res.status(201).json(
        {
          success: true,
          message:
            'Order created successfully',
          data: order,
        }
      );
    }
  )
);

// ============================================
// CANCEL ORDER
// ============================================

router.put(
  '/:id/cancel',
  protect,
  asyncHandler(
    async (req, res) => {
      const order =
        await Order.findOne(
          {
            _id:
              req.params.id,
            user:
              req.user._id,
          }
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

      if (
        ![
          'pending',
          'confirmed',
          'processing',
        ].includes(
          order.orderStatus
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Order cannot be cancelled now',
          });
      }

      // RESTORE STOCK

      for (const item of order.orderItems) {
        const product =
          await Product.findById(
            item.product
          );

        if (product) {
          product.stock +=
            item.quantity;

          if (
            typeof product.onlineStock ===
            'number'
          ) {
            product.onlineStock +=
              item.quantity;
          }

          await product.save();
        }
      }

      order.orderStatus =
        'cancelled';

      order.cancelledAt =
        new Date();

      order.cancelReason =
        req.body.reason ||
        'Cancelled by customer';

      await order.save();

      res.json({
        success: true,
        message:
          'Order cancelled successfully',
        data: order,
      });
    }
  )
);

// ============================================
// ADMIN STATS
// ============================================

router.get(
  '/admin/stats',
  protect,
  adminOnly,
  asyncHandler(
    async (req, res) => {
      const orders =
        await Order.find();

      const totalOrders =
        orders.length;

      const totalRevenue =
        orders
          .filter(
            (o) =>
              o.paymentStatus ===
              'paid'
          )
          .reduce(
            (
              sum,
              order
            ) =>
              sum +
              order.totalPrice,
            0
          );

      const pendingOrders =
        orders.filter(
          (o) =>
            o.orderStatus ===
            'pending'
        ).length;

      const deliveredOrders =
        orders.filter(
          (o) =>
            o.orderStatus ===
            'delivered'
        ).length;

      const cancelledOrders =
        orders.filter(
          (o) =>
            o.orderStatus ===
            'cancelled'
        ).length;

      res.json({
        success: true,
        data: {
          totalOrders,
          totalRevenue,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
        },
      });
    }
  )
);

export default router;