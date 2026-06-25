/**
 * GlamArt Database Seeder
 * Production Ready Seeder
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

// MODELS
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Store from './models/Store.js';
import Coupon from './models/Coupon.js';

// PRODUCTS DATA
import products from './data/productsData.js';

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

// LOAD ENV
dotenv.config({
  path: path.join(
    __dirname,
    '.env'
  ),
});

/* ============================================
   CATEGORIES
============================================ */

const categories = [

  {
    name:
      'Makeup',

    slug:
      'makeup',

    description:
      'Lipsticks, Foundations, Kajal & more',

    order:
      1,
  },

  {
    name:
      'Skincare',

    slug:
      'skincare',

    description:
      'Serums, Creams, Face Wash & more',

    order:
      2,
  },

  {
    name:
      'Haircare',

    slug:
      'haircare',

    description:
      'Shampoo, Conditioner & Hair Oils',

    order:
      3,
  },

  {
    name:
      'Fashion',

    slug:
      'fashion',

    description:
      'Kurtis, Dresses & Sarees',

    order:
      4,
  },

  {
    name:
      'Accessories',

    slug:
      'accessories',

    description:
      'Bags, Earrings & Watches',

    order:
      5,
  },

  {
    name:
      'Fragrance',

    slug:
      'fragrance',

    description:
      'Perfumes & Body Mists',

    order:
      6,
  },
];

/* ============================================
   STORES
============================================ */

const stores = [

  {
    name:
      'GlamArt Delhi',

    code:
      'DEL001',

    address: {

      street:
        'Connaught Place',

      city:
        'Delhi',

      state:
        'Delhi',

      pincode:
        '110001',
    },

    phone:
      '+91 9876543210',

    email:
      'delhi@glamart.com',
  },

  {
    name:
      'GlamArt Chennai',

    code:
      'CHE001',

    address: {

      street:
        'Express Avenue Mall',

      city:
        'Chennai',

      state:
        'Tamil Nadu',

      pincode:
        '600002',
    },

    phone:
      '+91 9876543211',

    email:
      'chennai@glamart.com',
  },
];

/* ============================================
   COUPONS
============================================ */

const coupons = [

  {
    code:
      'WELCOME10',

    description:
      '10% OFF on first order',

    discountType:
      'percentage',

    discountValue:
      10,

    minimumOrderValue:
      500,

    maximumDiscount:
      300,

    validFrom:
      new Date(),

    validUntil:
      new Date(
        Date.now() +
          365 *
            24 *
            60 *
            60 *
            1000
      ),

    isActive:
      true,
  },

  {
    code:
      'GLAM500',

    description:
      'Flat ₹500 OFF',

    discountType:
      'fixed',

    discountValue:
      500,

    minimumOrderValue:
      3000,

    maximumDiscount:
      500,

    validFrom:
      new Date(),

    validUntil:
      new Date(
        Date.now() +
          365 *
            24 *
            60 *
            60 *
            1000
      ),

    isActive:
      true,
  },
];

/* ============================================
   SEED DATABASE
============================================ */

const seedDatabase =
  async () => {

    try {

      // CONNECT DB
      await mongoose.connect(

        process.env
          .MONGODB_URI ||

        'mongodb://127.0.0.1:27017/glamart'
      );

      console.log(
        '✅ MongoDB Connected'
      );

      /* ============================================
         CLEAR OLD DATA
      ============================================ */

      await User.deleteMany();

      await Category.deleteMany();

      await Product.deleteMany();

      await Store.deleteMany();

      await Coupon.deleteMany();

      console.log(
        '🗑️ Old Data Removed'
      );

      /* ============================================
         CREATE ADMIN
      ============================================ */

      const hashedPassword =
        await bcrypt.hash(
          'admin123',
          10
        );

      const admin =
        await User.create({

          name:
            'Admin User',

          email:
            'admin@glamart.com',

          password:
            'admin123',

          phone:
            '+91 9876543210',

          role:
            'admin',
        });

      console.log(
        '✅ Admin Created'
      );

      /* ============================================
         CREATE CATEGORIES
      ============================================ */

   

      const createdCategories =
        await Category.insertMany(
          categories
        );

      console.log(
        `✅ ${createdCategories.length} Categories Created`
      );

      /* ============================================
         CATEGORY MAP
      ============================================ */

      const categoryMap = {};

      createdCategories.forEach(
        (category) => {

          categoryMap[
            category.slug
          ] =
            category._id;
        }
      );

      /* ============================================
         FINAL PRODUCTS
      ============================================ */
   const finalProducts = products.map((product) => {
  const mappedCategory = categoryMap[product.category];

  if (!mappedCategory) {
    console.log(
      '❌ Category not found:',
      product.title,
      product.category
    );
  }

  return {
    ...product,
    category: mappedCategory,
    createdBy: admin._id,
  };
});
      // const finalProducts =
      //   products.map(
      //     (product) => ({

      //       ...product,

      //       category:
      //         categoryMap[
      //           product.category
      //         ],

      //       createdBy:
      //         admin._id,
      //     })
      //   );

      /* ============================================
         INSERT PRODUCTS
      ============================================ */

      const createdProducts =
        await Product.insertMany(
          finalProducts
        );

      console.log(
        `✅ ${createdProducts.length} Products Created`
      );

      /* ============================================
         INSERT STORES
      ============================================ */

      await Store.insertMany(
        stores
      );

      console.log(
        '✅ Stores Created'
      );

      /* ============================================
         INSERT COUPONS
      ============================================ */

      await Coupon.insertMany(
        coupons
      );

      console.log(
        '✅ Coupons Created'
      );

      /* ============================================
         SUCCESS
      ============================================ */

      console.log(
        '\n🎉 DATABASE SEEDED SUCCESSFULLY'
      );

      console.log(
        '\n📧 ADMIN LOGIN'
      );

      console.log(
        'Email: admin@glamart.com'
      );

      console.log(
        'Password: admin123'
      );

      process.exit();

    } catch (error) {

      console.error(
        '❌ Seeder Error:',
        error
      );

      process.exit(1);
    }
  };

/* ============================================
   RUN SEEDER
============================================ */

seedDatabase();