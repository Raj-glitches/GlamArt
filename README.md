# GlamArt - Indian Omnichannel Beauty & Fashion Retailer

A production-ready MERN stack e-commerce platform similar to Nykaa/Myntra, focused on beauty, skincare, fashion, and accessories for Indian customers.

## Features

### Customer Features
- User Authentication (JWT)
- Browse products by category
- Search and filter products
- Shopping Cart
- Wishlist
- Product reviews & ratings
- Coupon code application
- Razorpay payment integration
- Order tracking
- User profile management

### Admin Features
- Admin dashboard with analytics
- Product management (CRUD)
- Category management
- User management
- Order management
- Sales analytics with charts

### Omnichannel Features
- Store pickup option
- Check product availability by pincode
- Inventory sync (online + offline)
- Store locator page

## Tech Stack

### Frontend
- React.js with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Router DOM
- Axios for API calls
- Chart.js for analytics

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Multer for image uploads
- Cloudinary for image storage

## Project Structure

```
GlamArt/
├── BackEnd/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   ├── Store.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── ...
│   ├── seeder.js
│   ├── server.js
│   └── .env.example
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── layout/
│   │   │   └── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   └── ...
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── productSlice.js
│   │   │   └── orderSlice.js
│   │   ├── store/
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```
bash
cd BackEnd
```

2. Install dependencies:
```
bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```
bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
FRONTEND_URL=http://localhost:5173
```

5. Run the backend:
```
bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```
bash
cd FrontEnd
```

:
```
bash
2. Install dependenciesnpm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## MongoDB Atlas Setup Guide

1. Create a free account at https://www.mongodb.com/cloud/atlas

2. Create a new cluster:
   - Click "Build a Cluster"
   - Choose the free tier (M0)
   - Select a provider and region
   - Click "Create Cluster"

3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Grant "Read and Write to any database"

4. Configure network access:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development

5. Get connection string:
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. Update your `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/glamart?retryWrites=true&w=majority
```

## Seeding Database

Run the seeder to populate initial data:
```
bash
cd BackEnd
npm run seed
```

This will create:
- Admin user (admin@glamart.com / admin123)
- Sample user (user@glamart.com / user123)
- Sample categories
- Sample products

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:slug - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Categories
- GET /api/categories - Get all categories
- POST /api/categories - Create category (admin)

### Orders
- GET /api/orders - Get user orders
- POST /api/orders - Create order
- PUT /api/orders/:id/status - Update order status (admin)

### Reviews
- GET /api/reviews/product/:productId - Get product reviews
- POST /api/reviews - Create review

## Demo Credentials

- **Admin**: admin@glamart.com / admin123
- **Customer**: user@glamart.com / user123

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/glamart
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=http://localhost:5173
```

## Building for Production

### Frontend
```
bash
cd FrontEnd
npm run build
```

The build output will be in the `dist` folder.

## License

MIT
