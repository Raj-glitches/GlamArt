/**
 * AI Beauty Chatbot Routes
 * Gemini 2.0 AI Integration
 */

import express from 'express';
import asyncHandler from 'express-async-handler';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Beauty Prompt
const SYSTEM_PROMPT = `
You are GlamArt AI Beauty Assistant.

You help users with:
- Makeup
- Skincare
- Haircare
- Fashion
- Accessories

You should:
- Be friendly
- Use emojis
- Suggest beauty products
- Suggest Indian beauty routines
- Give skincare advice
- Recommend outfits
- Keep responses short and stylish

End responses with:
"Anything else I can help with? 💖"
`;

// CHAT ROUTE
router.post(
  '/chat',
  asyncHandler(async (req, res) => {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    try {

      const response =
        await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `
${SYSTEM_PROMPT}

User:
${message}
          `,
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
          'AI chatbot failed. Check Gemini API quota/billing.',
      });
    }
  })
);

// CLEAR HISTORY
router.delete(
  '/history',
  asyncHandler(async (req, res) => {

    res.json({
      success: true,
      message: 'History cleared',
    });

  })
);

export default router;