/**
 * Product Model
 * Handles product data with inventory management
 */

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  sellingPrice: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  // Omnichannel inventory fields
  onlineStock: {
    type: Number,
    default: 0
  },
  offlineStock: {
    type: Number,
    default: 0
  },
  storeAvailability: [{
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store'
    },
    quantity: {
      type: Number,
      default: 0
    }
  }],
  images: [{
    public_id: String,
    url: String
  }],
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  // Product features
  features: [String],
  ingredients: String,
  howToUse: String,
  // Filter fields
  skinType: [String],
  hairType: [String],
  concern: [String],
  // SEO
  metaTitle: String,
  metaDescription: String,
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate selling price before saving
productSchema.pre('save', function(next) {
  this.sellingPrice = this.price - (this.price * this.discount / 100);
  this.updatedAt = Date.now();
  next();
});

// Index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);
