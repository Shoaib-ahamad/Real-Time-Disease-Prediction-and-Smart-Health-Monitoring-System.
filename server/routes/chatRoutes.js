const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const { protect } = require("../middleware/authMiddleware");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "AI error occurred." });
  }
});

module.exports = router;
