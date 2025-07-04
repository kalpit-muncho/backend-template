const express = require("express");
const router = express.Router();
const Data = require("../models/Data");
const Hero = require("../models/Hero");
const Gallery = require("../models/Gallery");
const FAQ = require("../models/FAQ");
const Footer = require("../models/Footer");
const Location = require("../models/Location");
const { Nav } = require("../models/NavFooter");
const Dish = require("../models/Dish");
const FeatureSection = require("../models/FeatureSection");
const Review = require("../models/Review");
const GiftCard = require("../models/GiftCard");
const Appearance = require("../models/Appearance");
const Card = require("../models/Card");

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post("/", async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const newData = new Data({ title, content, userId });
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId, sections } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const sectionMap = {
      hero: () => Hero.find({ userId }),
      gallery: () => Gallery.find({ userId }),
      faq: () => FAQ.find({ userId }),
      footer: () => Footer.find({ userId }),
      locations: () => Location.find({ userId }),
      nav: () => Nav.find({ userId }),
      menu: () => Dish.find({ userId }),
      features: () => FeatureSection.find({ userId }),
      reviews: () => Review.find({ userId }),
      giftcards: () => GiftCard.find({ userId }),
      cards: () => Card.findOne({ userId }),
    };

    let selectedSections;
    if (sections) {
      selectedSections = sections
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => sectionMap[s]);
      if (selectedSections.length === 0) {
        return res.status(400).json({ error: "No valid sections provided" });
      }
    } else {
      selectedSections = Object.keys(sectionMap);
    }

    const results = await Promise.all(
      selectedSections.map((key) => sectionMap[key]())
    );
    const appearance = await Appearance.findOne({ userId });
    const response = {};
    selectedSections.forEach((key, idx) => {
      response[key] = results[idx];
    });
    // Remove metaTitle/metaDescription from appearance in response
    if (appearance) {
      const { metaTitle, metaDescription, metaUpdatedAt, ...appearanceRest } =
        appearance.toObject();
      response.appearance = appearanceRest;
    } else {
      response.appearance = null;
    }
    const sectionTimestamps = [];
    for (const key of selectedSections) {
      const sectionData = response[key];
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        sectionData.forEach((item) => {
          if (item.updatedAt) sectionTimestamps.push(new Date(item.updatedAt));
          else if (item.createdAt)
            sectionTimestamps.push(new Date(item.createdAt));
        });
      } else if (
        sectionData &&
        (sectionData.updatedAt || sectionData.createdAt)
      ) {
        if (sectionData.updatedAt)
          sectionTimestamps.push(new Date(sectionData.updatedAt));
        else if (sectionData.createdAt)
          sectionTimestamps.push(new Date(sectionData.createdAt));
      }
    }
    const latestSectionUpdate =
      sectionTimestamps.length > 0
        ? new Date(Math.max(...sectionTimestamps.map((d) => d.getTime())))
        : null;
    let shouldRegenerateSEO = false;
    if (
      !appearance ||
      !appearance.metaTitle ||
      !appearance.metaDescription ||
      !appearance.metaUpdatedAt
    ) {
      shouldRegenerateSEO = true;
    } else if (
      latestSectionUpdate &&
      latestSectionUpdate > new Date(appearance.metaUpdatedAt)
    ) {
      shouldRegenerateSEO = true;
    }

    if (shouldRegenerateSEO) {
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const siteData = { ...response };
        const analysisPrompt = `Based on the following website data, generate an SEO-optimized meta title and meta description.\n\nRespond ONLY in the following JSON format:\n{\n  \"metaTitle\": \"...\",\n  \"metaDescription\": \"...\"\n}\n\nWebsite Data: ${JSON.stringify(
          siteData
        )}`;
        const result = await model.generateContent(analysisPrompt);
        let metaTitle = "";
        let metaDescription = "";
        try {
          const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const seoObj = JSON.parse(jsonMatch[0]);
            metaTitle = seoObj.metaTitle || "";
            metaDescription = seoObj.metaDescription || "";
          } else {
            metaDescription = result.response.text();
          }
        } catch (jsonErr) {
          metaDescription = result.response.text();
        }
        response.metaTitle = metaTitle;
        response.metaDescription = metaDescription;
        // Save to DB for caching (update or create Appearance)
        if (appearance) {
          appearance.metaTitle = metaTitle;
          appearance.metaDescription = metaDescription;
          appearance.metaUpdatedAt = latestSectionUpdate || new Date();
          await appearance.save();
        } else {
          // If no appearance exists, create one with meta fields
          await Appearance.create({
            userId,
            logo: "",
            metaTitle,
            metaDescription,
            metaUpdatedAt: latestSectionUpdate || new Date(),
          });
        }
      } catch (seoErr) {
        response.metaTitle = "";
        response.metaDescription = "";
      }
    } else {
      // Always fetch the latest from DB after possible update
      const freshAppearance = await Appearance.findOne({ userId });
      response.metaTitle = freshAppearance ? freshAppearance.metaTitle : "";
      response.metaDescription = freshAppearance
        ? freshAppearance.metaDescription
        : "";
    }
    // --- End SEO Analysis ---

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update data by id for a user
router.put("/:id", async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const data = await Data.findOneAndUpdate(
      { _id: req.params.id, userId },
      { title, content },
      { new: true }
    );
    if (!data)
      return res
        .status(404)
        .json({ error: "Data not found or not authorized" });
    // Invalidate SEO cache on update
    const Appearance = require("../models/Appearance");
    await Appearance.findOneAndUpdate(
      { userId },
      { metaTitle: "", metaDescription: "", metaUpdatedAt: null }
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove data by id for a user
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const data = await Data.findOneAndDelete({ _id: req.params.id, userId });
    if (!data)
      return res
        .status(404)
        .json({ error: "Data not found or not authorized" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
