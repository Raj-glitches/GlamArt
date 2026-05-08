// 3000+ Realistic Indian Beauty & Fashion Products Data
// Categories: Makeup, Skincare, Haircare, Fashion, Accessories

const categories = [
    'makeup-lipstick', 'makeup-foundation', 'makeup-eyeliner', 'makeup-eyeshadow', 'makeup-blush',
    'skincare-cleanser', 'skincare-moisturizer', 'skincare-serum', 'skincare-sunscreen', 'skincare-facewash',
    'haircare-shampoo', 'haircare-conditioner', 'haircare-oil', 'haircare-serum',
    'fashion-kurtis', 'fashion-tops', 'fashion-dresses', 'fashion-jeans',
    'accessories-earrings', 'accessories-bags', 'accessories-sunglasses'
];

const brands = [
    'Lakmé', 'Maybelline', 'LOréal Paris', 'MAC Cosmetics', 'Nykaa Luxe', 'Faces Canada',
    'Minimalist', 'The Ordinary', 'Plum', 'Mamaearth', 'Lotus Herbals', 'Biotique',
    'Parachute', 'Tresemmé', 'LOréal Professionnel', 'Wow Skin Science',
    'Myntra', 'H&M', 'Zara', 'Forever 21', 'Allen Solly', 'Roadster'
];

const generateProduct = (id) => {
    const category = categories[Math.floor(id / 120)];
    const brand = brands[Math.floor(id / 25) % brands.length];
    const catIndex = Math.floor(id / 120);

    const productsByCategory = {
        0: ['Matte Lipstick', 'Liquid Lipstick', 'Lip Gloss', 'Lip Balm'],
        1: ['Liquid Foundation', 'Powder Foundation', 'BB Cream', 'CC Cream'],
        2: ['Liquid Eyeliner', 'Pencil Eyeliner', 'Gel Eyeliner'],
        3: ['Eyeshadow Palette', 'Single Eyeshadow', 'Eyeshadow Primer'],
        4: ['Cream Blush', 'Powder Blush', 'Liquid Blush'],
        5: ['Face Wash', 'Micellar Water', 'Oil Cleanser'],
        6: ['Day Cream', 'Night Cream', 'Gel Moisturizer'],
        7: ['Vitamin C Serum', 'Hyaluronic Acid', 'Niacinamide Serum', 'Retinol Serum'],
        8: ['SPF 50 Sunscreen', 'SPF 30 Sunscreen', 'Tinted Sunscreen'],
        9: ['Gel Facewash', 'Foaming Cleanser', 'Cream Cleanser'],
        10: ['Anti Dandruff Shampoo', 'Sulphate Free Shampoo', 'Volume Shampoo'],
        11: ['Silk Conditioner', 'Repair Conditioner', 'Color Protect'],
        12: ['Coconut Oil', 'Argan Oil', 'Onion Oil'],
        13: ['Hair Serum', 'Heat Protectant Serum'],
        14: ['Cotton Silk Kurti', 'Printed Kurti', 'Embroidered Kurti'],
        15: ['Crop Top', 'Round Neck Top', 'V Neck Top'],
        16: ['Maxi Dress', 'Midi Dress', 'Bodycon Dress'],
        17: ['Skinny Fit Jeans', 'Mom Jeans', 'Boyfriend Jeans'],
        18: ['Hoop Earrings', 'Stud Earrings', 'Drop Earrings'],
        19: ['Tote Bag', 'Sling Bag', 'Crossbody Bag'],
        20: ['Aviator Sunglasses', 'Wayfarer Sunglasses', 'Round Sunglasses']
    };

    const productNames = productsByCategory[catIndex % Object.keys(productsByCategory).length] || ['Product'];
    const productName = productNames[id % productNames.length];

    const basePrice = Math.floor(Math.random() * 800) + 200;
    const discount = Math.floor(Math.random() * 50) + 10;
    const price = basePrice;
    const discountedPrice = Math.round(price * (1 - discount / 100));

    const skinTypes = ['All Skin Types', 'Oily Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin'];
    const colors = ['Red', 'Pink', 'Nude', 'Coral', 'Brown', 'Black', 'Beige', 'Ivory'];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const images = [
        `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1600) + 1}?w=400&fit=crop`,
        `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1600) + 1}?w=400&fit=crop`,
        `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1600) + 1}?w=400&fit=crop`
    ];

    return {
        title: `${brand} ${productName}`,

        slug: `${category}-${productName.toLowerCase().replace(/ /g, '-')}-${id}`,

        description: `Premium ${productName.toLowerCase()} perfect for Indian skin tones. ${brand} quality with long-lasting formula.`,

        brand,

        category: null,

        subcategory: productName,

        price,

        discount,

        sellingPrice: discountedPrice,

        stock: Math.floor(Math.random() * 100) + 50,

        onlineStock: Math.floor(Math.random() * 50) + 25,

        offlineStock: Math.floor(Math.random() * 30) + 10,

        ratings: Number((Math.random() * 1.5 + 3.5).toFixed(1)),

        isActive: true,

        isFeatured: Math.random() > 0.8,

        features: [
            'Long-lasting',
            'Premium Quality',
            'Best Seller'
        ],

        skinType: [
            skinTypes[Math.floor(Math.random() * skinTypes.length)]
        ],

        images: [
            {
                public_id: `product_${id}_1`,
                url: images[0]
            },
            {
                public_id: `product_${id}_2`,
                url: images[1]
            }
        ],

        color: colors[Math.floor(Math.random() * colors.length)],

        size: sizes[Math.floor(Math.random() * sizes.length)]
    };
};

const productsData = Array.from({ length: 3000 }, (_, i) => generateProduct(i));

export default productsData;

