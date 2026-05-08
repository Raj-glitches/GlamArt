/**
 * GlamArt Backend Server
 * Indian Omnichannel Beauty & Fashion Retailer API
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// ROUTES
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payment.js';
import storeRoutes from './routes/stores.js';
import chatbotRoutes from './routes/chatbot.js';

// MIDDLEWARE
import {
  errorHandler,
  notFound,
} from './middleware/errorMiddleware.js';

import {
  helmetMiddleware,
  limiter,
} from './middleware/securityMiddleware.js';

// PATH
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOAD ENV
dotenv.config({
  path: path.join(__dirname, '.env'),
});

// DEBUG ENV
console.log(
  '✅ GEMINI KEY EXISTS:',
  !!process.env.GEMINI_API_KEY
);

console.log(
  '✅ MONGODB URI EXISTS:',
  !!process.env.MONGODB_URI
);

const app = express();

// SECURITY
app.use(helmetMiddleware);
app.use(limiter);

// CORS
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      'http://localhost:5173',
    credentials: true,
  })
);

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES
app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/chatbot', chatbotRoutes);

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GlamArt API Running',
  });
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

// PORT
const PORT = process.env.PORT || 5000;

// START SERVER
const startServer = async () => {
  try {
    // MONGODB CONNECT
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      '✅ MongoDB Connected Successfully'
    );

    app.listen(PORT, () => {
      console.log(`
🚀 Server Running
🌐 PORT: ${PORT}
📦 API: http://localhost:${PORT}/api
🤖 Chatbot: http://localhost:${PORT}/api/chatbot/chat
      `);
    });

  } catch (error) {

    console.error(
      '❌ SERVER ERROR:',
      error.message
    );

    process.exit(1);
  }
};

startServer();

export default app;