const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate SEO-friendly heading and description
router.post("/generate-seo", async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate multiple headings
    const headingPrompt = `Generate three distinct, SEO-optimized H1 heading options for the following content. Return only the headings as a JSON array of strings. Content: ${content}`;
    const headingResult = await model.generateContent(headingPrompt);
    let headings;
    try {
      headings = JSON.parse(headingResult.response.text());
    } catch (e) {
      headings = [headingResult.response.text()];
    }

    // Generate multiple descriptions
    const descriptionPrompt = `Generate three distinct, SEO-optimized meta description options for the following content. Return only the descriptions as a JSON array of strings. Content: ${content}`;
    const descriptionResult = await model.generateContent(descriptionPrompt);
    let descriptions;
    try {
      descriptions = JSON.parse(descriptionResult.response.text());
    } catch (e) {
      descriptions = [descriptionResult.response.text()];
    }

    res.json({ headings, descriptions });
  } catch (error) {
    console.error("Gemini SDK error:", error);
    if (error.response) {
      console.error("Gemini SDK error response:", error.response.data);
    }
    res.status(500).json({ error: "Failed to generate SEO content." });
  }
});


module.exports = router;
