/**
 * Order Model
 * Handles order management with omnichannel support
 */

import mongoose from 'mongoose';

// ============================================
// ORDER ITEM SCHEMA
// ============================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// ============================================
// SHIPPING ADDRESS SCHEMA
// ============================================

const shippingAddressSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      street: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

// ============================================
// ORDER SCHEMA
// ============================================

const orderSchema =
  new mongoose.Schema(
    {
      // ============================================
      // USER
      // ============================================

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      // ============================================
      // ITEMS
      // ============================================

      orderItems: {
        type: [orderItemSchema],
        required: true,
        validate: {
          validator: function (
            items
          ) {
            return (
              Array.isArray(
                items
              ) &&
              items.length > 0
            );
          },
          message:
            'Order must contain at least one item',
        },
      },

      // ============================================
      // SHIPPING
      // ============================================

      shippingAddress:
        shippingAddressSchema,

      // ============================================
      // DELIVERY
      // ============================================

      deliveryMethod: {
        type: String,
        enum: [
          'home_delivery',
          'store_pickup',
        ],
        default:
          'home_delivery',
      },

      pickupStore: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        default: null,
      },

      // ============================================
      // PAYMENT
      // ============================================

      paymentMethod: {
        type: String,
        enum: [
          'razorpay',
          'stripe',
          'cod',
          'card',
          'upi',
          'wallet',
        ],
        default:
          'razorpay',
      },

      paymentGateway: {
        type: String,
        enum: [
          'razorpay',
          'stripe',
          'cod',
          'upi',
          'wallet',
        ],
        default:
          'razorpay',
      },

      paymentStatus: {
        type: String,
        enum: [
          'pending',
          'paid',
          'failed',
          'refunded',
        ],
        default:
          'pending',
      },

      paymentId: {
        type: String,
        default: '',
      },

      transactionId: {
        type: String,
        default: '',
      },

      razorpayOrderId: {
        type: String,
        default: '',
      },

      stripePaymentIntentId:
        {
          type: String,
          default: '',
        },

      // ============================================
      // PRICING
      // ============================================

      itemsPrice: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      taxPrice: {
        type: Number,
        default: 0,
        min: 0,
      },

      shippingPrice: {
        type: Number,
        default: 0,
        min: 0,
      },

      discountPrice: {
        type: Number,
        default: 0,
        min: 0,
      },

      couponUsed: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      // ============================================
      // ORDER STATUS
      // ============================================

      orderStatus: {
        type: String,
        enum: [
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'out_for_delivery',
          'delivered',
          'cancelled',
        ],
        default: 'pending',
      },

      // ============================================
      // TRACKING
      // ============================================

      trackingNumber: {
        type: String,
        default: '',
      },

      shippedAt: {
        type: Date,
        default: null,
      },

      deliveredAt: {
        type: Date,
        default: null,
      },

      cancelledAt: {
        type: Date,
        default: null,
      },

      cancelReason: {
        type: String,
        default: '',
      },

      // ============================================
      // NOTES
      // ============================================

      notes: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    }
  );

// ============================================
// AUTO UPDATE STATUS DATES
// ============================================

orderSchema.pre(
  'save',
  function (next) {
    // Delivered
    if (
      this.isModified(
        'orderStatus'
      ) &&
      this.orderStatus ===
        'delivered'
    ) {
      this.deliveredAt =
        new Date();
    }

    // Shipped
    if (
      this.isModified(
        'orderStatus'
      ) &&
      this.orderStatus ===
        'shipped'
    ) {
      this.shippedAt =
        new Date();
    }

    // Cancelled
    if (
      this.isModified(
        'orderStatus'
      ) &&
      this.orderStatus ===
        'cancelled'
    ) {
      this.cancelledAt =
        new Date();
    }

    next();
  }
);

// ============================================
// VIRTUALS
// ============================================

orderSchema.virtual(
  'totalItems'
).get(function () {
  return this.orderItems.reduce(
    (total, item) =>
      total +
      item.quantity,
    0
  );
});

// ============================================
// INDEXES
// ============================================

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  orderStatus: 1,
});

orderSchema.index({
  paymentStatus: 1,
});

orderSchema.index({
  paymentMethod: 1,
});

// ============================================
// EXPORT
// ============================================

const Order =
  mongoose.model(
    'Order',
    orderSchema
  );

export default Order;