/**
 * Database Seeder
 * Seeds initial data for GlamArt
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Store from './models/Store.js';
import Coupon from './models/Coupon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Sample Categories
const categories = [
  {
    name: 'Makeup',
    slug: 'makeup',
    description: 'Lipstick, Foundation, Eyeshadow & more',
    order: 1
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    description: 'Moisturizers, Serums, Cleansers & more',
    order: 2
  },
  {
    name: 'Haircare',
    slug: 'haircare',
    description: 'Shampoos, Conditioners, Hair Oils & more',
    order: 3
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, Sarees, Kurtas & more',
    order: 4
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Jewelry, Bags, Watches & more',
    order: 5
  },
  {
    name: 'Fragrance',
    slug: 'fragrance',
    description: 'Perfumes, Deodorants & more',
    order: 6
  }
];

// Sample Products
const products = [
  {
    title: 'Matte Lipstick - Ruby Red',
    description: 'Long-lasting matte lipstick with vibrant color. Enriched with vitamin E for moisturization.',
    brand: 'GlamArt Beauty',
    category: null, // Will be set after categories are created
    price: 499,
    discount: 20,
    stock: 100,
    onlineStock: 80,
    offlineStock: 20,
    features: ['Matte Finish', 'Long-lasting', 'Vitamin E'],
    skinType: ['All Skin Types'],
    concern: ['Dry Lips'],
    isFeatured: true,
    images: [
      {
        public_id: 'sample_lipstick_1',
        url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'
      }
    ]
  },
  {
    title: 'Hydrating Face Serum',
    description: 'Vitamin C serum for bright and glowing skin. Reduces dark spots and evens skin tone.',
    brand: 'Radiance',
    category: null,
    price: 899,
    discount: 15,
    stock: 75,
    onlineStock: 60,
    offlineStock: 15,
    features: ['Vitamin C', 'Brightening', 'Anti-aging'],
    skinType: ['All Skin Types'],
    concern: ['Dullness', 'Dark Spots'],
    isFeatured: true,
    images: [
      {
        public_id: 'sample_serum_1',
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'
      }
    ]
  },
  {
    title: 'Aloe Vera Gel',
    description: 'Pure aloe vera gel for soothing and hydrating skin. Ideal for sunburn and daily moisturization.',
    brand: 'NatureCare',
    category: null,
    price: 299,
    discount: 10,
    stock: 150,
    onlineStock: 120,
    offlineStock: 30,
    features: ['Aloe Vera', 'Soothing', 'Hydrating'],
    skinType: ['All Skin Types', 'Sensitive Skin'],
    concern: ['Sunburn', 'Dryness'],
    isFeatured: false,
    images: [
      {
        public_id: 'sample_aloe_1',
        url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400'
      }
    ]
  },
  {
    title: 'Anti-Hair Fall Shampoo',
    description: 'Strengthening shampoo with biotin and keratin. Reduces hair fall and promotes growth.',
    brand: 'HairVital',
    category: null,
    price: 399,
    discount: 25,
    stock: 80,
    onlineStock: 65,
    offlineStock: 15,
    features: ['Biotin', 'Keratin', 'Sulfate-free'],
    hairType: ['All Hair Types'],
    concern: ['Hair Fall', 'Thinning'],
    isFeatured: true,
    images: [
      {
        public_id: 'sample_shampoo_1',
        url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'
      }
    ]
  },
  {
    title: 'Silk Saree - Pink',
    description: 'Beautiful pink silk saree with elegant border work. Perfect for weddings and festivals.',
    brand: 'FabStyle',
    category: null,
    price: 2999,
    discount: 30,
    stock: 25,
    onlineStock: 15,
    offlineStock: 10,
    features: ['Pure Silk', 'Handwoven', 'Festive Wear'],
    isFeatured: true,
    images: [
      {
        public_id: 'sample_saree_1',
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'
      }
    ]
  },
  {
    title: 'Gold Plated Earrings',
    description: 'Elegant gold plated earrings with pearl drop. Perfect for traditional wear.',
    brand: 'ArtJewels',
    category: null,
    price: 899,
    discount: 40,
    stock: 60,
    onlineStock: 45,
    offlineStock: 15,
    features: ['Gold Plated', 'Pearl', 'Lightweight'],
    isFeatured: false,
    images: [
      {
        public_id: 'sample_earrings_1',
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'
      }
    ]
  },
  {
    title: 'Floral Perfume - 50ml',
    description: 'Long-lasting floral fragrance with notes of jasmine and rose.',
    brand: 'Bloom',
    category: null,
    price: 799,
    discount: 20,
    stock: 90,
    onlineStock: 70,
    offlineStock: 20,
    features: ['Floral', 'Long-lasting', '50ml'],
    isFeatured: true,
    images: [
      {
        public_id: 'sample_perfume_1',
        url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'
      }
    ]
  },
  {
    title: 'Kajal - Black',
    description: 'Smudge-proof kajal with intense black color. Lasts up to 12 hours.',
    brand: 'GlamArt Beauty',
    category: null,
    price: 199,
    discount: 15,
    stock: 120,
    onlineStock: 100,
    offlineStock: 20,
    features: ['Smudge-proof', 'Waterproof', 'Intense Black'],
    skinType: ['All Skin Types'],
    concern: ['Sensitive Eyes'],
    isFeatured: false,
    images: [
      {
        public_id: 'sample_kajal_1',
        url: 'https://images.unsplash.com/photo-1591196775685-860f746d3ac8?w=400'
      }
    ]
  }
];

// Sample Stores
const stores = [
  {
    name: 'GlamArt Flagship Store',
    code: 'DEL001',
    address: {
      street: 'Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    coordinates: {
      lat: 28.6315,
      lng: 77.2197
    },
    phone: '+91 98765 43210',
    email: 'delhi@glamart.com',
    features: ['Makeup Studio', 'Skin Consultation', 'Click & Collect'],
    openingHours: {
      monday: { open: '10:00', close: '21:00', closed: false },
      tuesday: { open: '10:00', close: '21:00', closed: false },
      wednesday: { open: '10:00', close: '21:00', closed: false },
      thursday: { open: '10:00', close: '21:00', closed: false },
      friday: { open: '10:00', close: '21:00', closed: false },
      saturday: { open: '10:00', close: '21:00', closed: false },
      sunday: { open: '11:00', close: '20:00', closed: false }
    }
  },
  {
    name: 'GlamArt Mumbai',
    code: 'MUM001',
    address: {
      street: 'Linking Road, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    coordinates: {
      lat: 19.0760,
      lng: 72.8777
    },
    phone: '+91 98765 43211',
    email: 'mumbai@glamart.com',
    features: ['Makeup Studio', 'Fragrance Bar', 'Express Pickup'],
    openingHours: {
      monday: { open: '10:00', close: '22:00', closed: false },
      tuesday: { open: '10:00', close: '22:00', closed: false },
      wednesday: { open: '10:00', close: '22:00', closed: false },
      thursday: { open: '10:00', close: '22:00', closed: false },
      friday: { open: '10:00', close: '22:00', closed: false },
      saturday: { open: '10:00', close: '22:00', closed: false },
      sunday: { open: '11:00', close: '21:00', closed: false }
    }
  },
  {
    name: 'GlamArt Bangalore',
    code: 'BLR001',
    address: {
      street: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    coordinates: {
      lat: 12.9716,
      lng: 77.5946
    },
    phone: '+91 98765 43212',
    email: 'bangalore@glamart.com',
    features: ['Skin Analysis', 'Hair Care Studio', 'Click & Collect'],
    openingHours: {
      monday: { open: '10:00', close: '21:00', closed: false },
      tuesday: { open: '10:00', close: '21:00', closed: false },
      wednesday: { open: '10:00', close: '21:00', closed: false },
      thursday: { open: '10:00', close: '21:00', closed: false },
      friday: { open: '10:00', close: '21:00', closed: false },
      saturday: { open: '10:00', close: '21:00', closed: false },
      sunday: { open: '11:00', close: '20:00', closed: false }
    }
  }
];

// Sample Coupons
const coupons = [
  {
    code: 'WELCOME10',
    description: 'Welcome discount for new users',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderValue: 500,
    maximumDiscount: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    isActive: true
  },
  {
    code: 'FLAT200',
    description: 'Flat ₹200 off on orders above ₹1000',
    discountType: 'fixed',
    discountValue: 200,
    minimumOrderValue: 1000,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    isActive: true
  }
];

// Connect to MongoDB and seed
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/glamart');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Store.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@glamart.com',
      password: adminPassword,
      phone: '+91 98765 43210',
      role: 'admin'
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Created categories:', createdCategories.length);

    // Map products to categories
    const categoryMap = {
      'makeup': createdCategories.find(c => c.slug === 'makeup')._id,
      'skincare': createdCategories.find(c => c.slug === 'skincare')._id,
      'haircare': createdCategories.find(c => c.slug === 'haircare')._id,
      'fashion': createdCategories.find(c => c.slug === 'fashion')._id,
      'accessories': createdCategories.find(c => c.slug === 'accessories')._id,
      'fragrance': createdCategories.find(c => c.slug === 'fragrance')._id
    };

    // Assign categories to products
    products[0].category = categoryMap.makeup; // Lipstick
    products[1].category = categoryMap.skincare; // Serum
    products[2].category = categoryMap.skincare; // Aloe Vera
    products[3].category = categoryMap.haircare; // Shampoo
    products[4].category = categoryMap.fashion; // Saree
    products[5].category = categoryMap.accessories; // Earrings
    products[6].category = categoryMap.fragrance; // Perfume
    products[7].category = categoryMap.makeup; // Kajal

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log('✅ Created products:', createdProducts.length);

    // Create stores
    const createdStores = await Store.insertMany(stores);
    console.log('✅ Created stores:', createdStores.length);

    // Create coupons
    const createdCoupons = await Coupon.insertMany(coupons);
    console.log('✅ Created coupons:', createdCoupons.length);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Admin: admin@glamart.com / admin123');
    console.log('\n👤 Customer login: Register a new account');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
