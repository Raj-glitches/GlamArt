const products = [
  {
    title: "Matte Velvet Lipstick",
    category: null,
    subcategory: "Lipstick",
    brand: "Lakme",

    price: 499,
    discount: 10,
    sellingPrice: 449,

    stock: 50,
    onlineStock: 35,
    offlineStock: 15,

    ratings: 4.5,

    isActive: true,
    isFeatured: true,

    description: "Long-lasting matte lipstick with rich color.",

    features: [
      "Matte Finish",
      "Long Lasting",
      "Vitamin E"
    ],

    images: [
      {
        public_id: "lipstick_1",
        url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400"
      }
    ]
  },

  {
    title: "Liquid Foundation",
    category: null,
    subcategory: "Foundation",
    brand: "Maybelline",

    price: 699,
    discount: 15,
    sellingPrice: 594,

    stock: 40,
    onlineStock: 25,
    offlineStock: 15,

    ratings: 4.3,

    isActive: true,
    isFeatured: true,

    description: "Smooth coverage foundation.",

    features: [
      "Full Coverage",
      "Natural Finish"
    ],

    images: [
      {
        public_id: "foundation_1",
        url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400"
      }
    ]
  },

  {
    title: "Vitamin C Serum",
    category: null,
    subcategory: "Serums",
    brand: "Minimalist",

    price: 799,
    discount: 20,
    sellingPrice: 639,

    stock: 35,
    onlineStock: 20,
    offlineStock: 15,

    ratings: 4.6,

    isActive: true,
    isFeatured: true,

    description: "Brightening serum for glowing skin.",

    features: [
      "Vitamin C",
      "Brightening",
      "Glow Boost"
    ],

    images: [
      {
        public_id: "serum_1",
        url: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400"
      }
    ]
  },

  {
    title: "Moisturizing Cream",
    category: null,
    subcategory: "Moisturizers",
    brand: "Nivea",

    price: 399,
    discount: 10,
    sellingPrice: 359,

    stock: 60,
    onlineStock: 40,
    offlineStock: 20,

    ratings: 4.2,

    isActive: true,

    description: "Hydrating cream for soft skin.",

    features: [
      "Deep Moisture",
      "Soft Skin"
    ],

    images: [
      {
        public_id: "cream_1",
        url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400"
      }
    ]
  },

  {
    title: "Herbal Shampoo",
    category: null,
    subcategory: "Shampoo",
    brand: "Dove",

    price: 349,
    discount: 12,
    sellingPrice: 307,

    stock: 55,
    onlineStock: 35,
    offlineStock: 20,

    ratings: 4.3,

    isActive: true,

    description: "Nourishing shampoo.",

    features: [
      "Herbal Formula",
      "Smooth Hair"
    ],

    images: [
      {
        public_id: "shampoo_1",
        url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400"
      }
    ]
  }
];

export default products;