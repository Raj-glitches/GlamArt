/**
 * GlamArt Database Seeder
 * 30 Products Per Category
 * 6 Categories
 * Total = 180 Products
 * Each product has 3 images
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

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    name: 'Makeup',
    slug: 'makeup',
    description: 'Lipsticks, Foundations, Kajal & more',
    order: 1,
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    description: 'Serums, Creams, Face Wash & more',
    order: 2,
  },
  {
    name: 'Haircare',
    slug: 'haircare',
    description: 'Shampoo, Conditioner & Hair Oils',
    order: 3,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Kurtis, Dresses & Sarees',
    order: 4,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Bags, Earrings & Watches',
    order: 5,
  },
  {
    name: 'Fragrance',
    slug: 'fragrance',
    description: 'Perfumes & Body Mists',
    order: 6,
  },
];

/* =========================================================
   PRODUCT TEMPLATES
========================================================= */

const productTemplates = {
  makeup: [
    'Matte Lipstick',
    'Liquid Foundation',
    'Kajal Eyeliner',
    'Compact Powder',
    'BB Cream',
  ],

  skincare: [
    'Vitamin C Serum',
    'Face Wash',
    'Moisturizing Cream',
    'Sunscreen SPF 50',
    'Night Gel',
  ],

  haircare: [
    'Herbal Shampoo',
    'Hair Conditioner',
    'Hair Oil',
    'Hair Serum',
    'Anti Dandruff Shampoo',
  ],

  fashion: [
    'Floral Dress',
    'Designer Kurti',
    'Silk Saree',
    'Crop Top',
    'Denim Jeans',
  ],

  accessories: [
    'Leather Handbag',
    'Gold Earrings',
    'Luxury Watch',
    'Sunglasses',
    'Wallet',
  ],

  fragrance: [
    'Luxury Perfume',
    'Body Mist',
    'Rose Perfume',
    'Vanilla Mist',
    'Oud Fragrance',
  ],
};

/* =========================================================
   BRANDS
========================================================= */

const brands = {
  makeup: ['Lakmé', 'Maybelline', 'MAC', 'Huda Beauty'],
  skincare: ['Minimalist', 'Cetaphil', 'Dot & Key', 'Nivea'],
  haircare: ['Dove', 'Tresemme', 'LOréal', 'Parachute'],
  fashion: ['Zara', 'Biba', 'H&M', 'Forever 21'],
  accessories: ['Caprese', 'Fossil', 'Titan', 'Tanishq'],
  fragrance: ['Chanel', 'Dior', 'Bella Vita', 'Bath & Body Works'],
};

/* =========================================================
   PRODUCT IMAGES
========================================================= */

const imageCollections = {
  makeup: [
    'https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/resize-w:1024/000000000494411478/dTDN_VfcaBch-000000000494411478_1.jpg',
    'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRVBJsEP8qokAdOj2i5fiTMZ4evzQYT073bbfuWpfh_UJImK9u6Ur0GLZWQouHIx7qWg5vCW4A7SjSi-VV-ob_Lk7lQBcOeaCXaRo8_rYR_MMwKjsVzDQX3Ew',
    'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSUZeYiJBhWo6Es9tw_vg2s9vBm4anrupqk-olgG7FdxXGElItu24_XSoi0RWaKqQkRNhbcKQDlr4Cs_cUTd-SGwpAt9ocINvttVMo6CPSjt4EUUa_dE6ojKQ',
  ],

  skincare: [
    'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/streams/2012/November/121120/1C4846116-expensive-creams-05.jpg',
    'https://static.beautytocare.com/cdn-cgi/image/width=1440,height=1200,f=auto/media/catalog/product//b/e/beauty-of-joseon-revive-serum-ginseng-snail-mucin-30ml.jpg',
    'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/sio/sio83064/v/20.jpg',
  ],

  haircare: [
    'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTSme3txQH3NDRZ-hPK-TVQu-xdf4zmS6k6VtX-bNhh2HombT_UmntFWkXSIGDezqeEo3dUt8pPD0oT60-4V3ez-NA1YVLbOzAnWWfDheipG9wIRy6f_D2JRQ',
    'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQVYb5MkrvrrsJ-d8bb_ECkhQiv1_5S0MKYSaBRzkZeJKnvnLfF_dxvzmPdAicP4ItvssSM6_ZyoKbMukyJPyxkoAnRhuhNYfr4H4WOCJHSZo8NcArwtvgybw',
    'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTWY0aLbEr4XenuVqTYlWnR_aJ7uTRagLY5EnIBogMoQebX1CN3_-pt-3jtS3qsLdznCv2kj8zk4MulmHMmEVVcjKUFi8TzpLo8PAiyNJOgIrRMOCJ3F7FYQBHP__qd7k9MYSxVSQ&usqp=CAc',
  ],

  fashion: [
    'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSQ7xKASdqZ9sS9V0_Mraxv1csgtXQsf0WJ2sdvRvMAJi8QOvhEeK_A-Kxzghposu29oDT8UHuZGeBNks6nlyJimkWt27r0MsAknftW4k77poY5Zn63oUWOpw&usqp=CAc',
    'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTJ8VApd6l7WPy-AnBCNgU8ezPpPV_9y_NxtU5ftr6cym6f-NDqZ1qf1QuU6jzgtz76UBMdChraTpxXxKdFZIwoSxT1LuqaK6dP8y6dWQxbp8bgxyxMEmOU&usqp=CAc',
    'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcThFcjWgRRDyqERjiF-IbcagIhnqz9GZ5mvoVKMwc9KJ5RqBtJJIahRSCvXiKurtPOk2EavSotLkrJM6DAZBcMtV8XnfvCHPmJO_w5NoCcuCrAOnwbB1ibiAA',
  ],

  accessories: [
    'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSVZFD9KgFjZ8LFhmUv48t213XgAU_H-EKTeu3RWqsFb5Q7xW9bcryaeIql33WxnJYEGbGrLtnit9BZ1ZtW1nfJQotDhHAcATu4iPPCZY9s4nO_tcIZXqOITemdIUTI8_HmYH2UT6mWB7o&usqp=CAc',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-mGsCZpvSyC6_s8mqUaY0phAkoDqNPirvmQ&s',
    'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRW9DgRt5hXW5K78VDtB-KHOqQSQOLgB5aj1eCXsmDkfwyMklVi5G3uggtKMZa2gDy0wdztXIgYFqvO0CLSJo8Ko-QStFSFUoftRZ_I6uHOlD7KQiV3MoDB2lot',
  ],

  fragrance: [
    'https://itscontraband.com/cdn/shop/files/have-it-all-50ml.jpg?v=1775555079&width=1080',
    'https://m.media-amazon.com/images/I/31xGUeDeKXL._SS400_.jpg',
    'https://m.media-amazon.com/images/I/61EK7YtIDsL._SX679_.jpg',
  ],
};
/* =========================================================
   GENERATE PRODUCTS
========================================================= */

const products = [];

Object.keys(productTemplates).forEach((categoryKey) => {
  for (let i = 1; i <= 30; i++) {
    const titles = productTemplates[categoryKey];
    const brandsList = brands[categoryKey];
    const images = imageCollections[categoryKey];

    const title = titles[i % titles.length];
    const brand = brandsList[i % brandsList.length];

    const price = Math.floor(Math.random() * 3000) + 299;
    const discount = Math.floor(Math.random() * 40) + 5;

    const slug = `${brand}-${title}-${i}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    products.push({
      title: `${brand} ${title}`,
      slug,

      description: `Premium ${title.toLowerCase()} designed for Indian customers with luxury quality and long-lasting performance.`,

      brand,

      categoryKey,

      subcategory: title,

      price,

      discount,

      sellingPrice: Math.round(
        price - (price * discount) / 100
      ),

      stock: Math.floor(Math.random() * 100) + 20,

      onlineStock: Math.floor(Math.random() * 70) + 10,

      offlineStock: Math.floor(Math.random() * 40) + 5,

      ratings: Number(
        (Math.random() * 2 + 3).toFixed(1)
      ),

      numReviews: Math.floor(
        Math.random() * 500
      ),

      skinType: ['All Skin Types'],

      concern: ['Daily Care'],

      features: [
        'Premium Quality',
        'Long Lasting',
        'Best Seller',
      ],

      isFeatured: i % 6 === 0,

      isActive: true,

      images: [
        {
          public_id: `${slug}-1`,
          url: images[0],
        },
        {
          public_id: `${slug}-2`,
          url: images[1],
        },
        {
          public_id: `${slug}-3`,
          url: images[2],
        },
      ],
    });
  }
});

/* =========================================================
   STORES
========================================================= */

const stores = [
  {
    name: 'GlamArt Delhi',
    code: 'DEL001',
    address: {
      street: 'Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    phone: '+91 9876543210',
    email: 'delhi@glamart.com',
  },
];

/* =========================================================
   COUPONS
========================================================= */

const coupons = [
  {
    code: 'WELCOME10',
    description: '10% OFF',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderValue: 500,
    maximumDiscount: 300,
    validFrom: new Date(),
    validUntil: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000
    ),
    isActive: true,
  },
];

/* =========================================================
   SEED DATABASE
========================================================= */

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb://127.0.0.1:27017/glamart'
    );

    console.log('✅ MongoDB Connected');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Store.deleteMany();
    await Coupon.deleteMany();

    console.log('🗑️ Existing Data Removed');

    // Admin User
    const hashedPassword = await bcrypt.hash(
      'admin123',
      10
    );

    await User.create({
      name: 'Admin User',
      email: 'admin@glamart.com',
      password: hashedPassword,
      phone: '+91 9876543210',
      role: 'admin',
    });

    console.log('✅ Admin Created');

    // Categories
    const createdCategories =
      await Category.insertMany(categories);

    const categoryMap = {};

    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Products
    const finalProducts = products.map((product) => ({
      ...product,
      category: categoryMap[product.categoryKey],
    }));

    const createdProducts =
      await Product.insertMany(finalProducts);

    console.log(
      `✅ ${createdProducts.length} Products Created`
    );

    // Stores
    await Store.insertMany(stores);

    console.log('✅ Stores Created');

    // Coupons
    await Coupon.insertMany(coupons);

    console.log('✅ Coupons Created');

    console.log('\n🎉 DATABASE SEEDED SUCCESSFULLY');

    console.log('\n📧 ADMIN LOGIN');
    console.log('Email: admin@glamart.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedDatabase();