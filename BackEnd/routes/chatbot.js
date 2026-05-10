import express from 'express';
import asyncHandler from 'express-async-handler';
import { GoogleGenAI } from '@google/genai';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post(
  '/chat',
  protect,
  asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    try {
      const response =
        await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: message,
        });

      res.json({
        success: true,
        data: {
          message: response.text,
        },
      });

    } catch (error) {

      console.error(
        '❌ CHATBOT ERROR:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'AI chatbot failed',
      });
    }
  })
);

router.get(
  '/history',
  protect,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data:
        req.user.chatHistory || [],
    });
  })
);

router.delete(
  '/history',
  protect,
  asyncHandler(async (req, res) => {

    req.user.chatHistory = [];

    await req.user.save();

    res.json({
      success: true,
      message:
        'Chat history cleared',
    });
  })
);

export default router;