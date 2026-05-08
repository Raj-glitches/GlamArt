/**
 * Store Model
 * Handles physical store data for omnichannel
 */

import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  phone: String,
  email: String,
  // Store timings
  openingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  // Store features
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    public_id: String,
    url: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Store', storeSchema);
