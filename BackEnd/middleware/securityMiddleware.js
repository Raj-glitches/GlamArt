import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';

/**
 * Helmet middleware for security headers
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      imgSrc: ["'self'", 'data:', 'https:', 'http://localhost:5000'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
    }
  }
});

/**
 * Rate limiting middleware
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

/**
 * Auth rate limiting (more strict)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  }
});

/**
 * Product validation schemas
 */
export const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    brand: Joi.string().min(2).max(50).required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    countInStock: Joi.number().min(0).required(),
    rating: Joi.number().min(0).max(5),
    discount: Joi.number().min(0).max(100),
    images: Joi.array().items(Joi.string().uri())
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

/**
 * User registration validation
 */
export const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

/**
 * Order validation
 */
export const validateOrder = (req, res, next) => {
  const schema = Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required()
      })
    ).required(),
    totalPrice: Joi.number().min(0).required(),
    paymentMethod: Joi.string().valid('card', 'razorpay', 'cod').required(),
    deliveryAddress: Joi.object().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

