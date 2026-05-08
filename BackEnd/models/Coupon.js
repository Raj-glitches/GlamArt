/**
 * Coupon Model
 * Handles discount coupons
 */

import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: [0, 'Discount value cannot be negative']
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  maximumDiscount: {
    type: Number
  },
  // Usage limits
  usageLimit: {
    type: Number
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  // Validity
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  // Target
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.usageLimit || this.usedCount < this.usageLimit)
  );
};

// Calculate discount
couponSchema.methods.calculateDiscount = function(orderTotal) {
  if (orderTotal < this.minimumOrderValue) {
    return 0;
  }

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderTotal * this.discountValue) / 100;
  } else {
    discount = this.discountValue;
  }

  if (this.maximumDiscount) {
    discount = Math.min(discount, this.maximumDiscount);
  }

  return Math.round(discount);
};

export default mongoose.model('Coupon', couponSchema);
