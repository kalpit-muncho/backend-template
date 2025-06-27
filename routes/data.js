const express = require("express");
const router = express.Router();
const Data = require("../models/Data");
const Hero = require("../models/Hero");
const Gallery = require("../models/Gallery");
const FAQ = require("../models/FAQ");
const Footer = require("../models/Footer");
const Location = require("../models/Location");
const { Nav } = require("../models/NavFooter");
const Dish = require("../models/Dish"); // Added for menu
const FeatureSection = require("../models/FeatureSection"); // Added for features
const Review = require("../models/Review"); // Added for reviews
const GiftCard = require("../models/GiftCard"); // Added for gift cards

// Middleware example: log request method and path
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// POST: Upload data for a user
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

// GET: Retrieve all section data for a user
router.get("/", async (req, res) => {
  try {
    const { userId, sections } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    // Map section keys to their corresponding model queries
    const sectionMap = {
      hero: () => Hero.find({ userId }).sort({ createdAt: -1 }),
      gallery: () => Gallery.find({ userId }).sort({ createdAt: -1 }),
      faq: () => FAQ.find({ userId }).sort({ createdAt: -1 }),
      footer: () => Footer.find({ userId }).sort({ createdAt: -1 }),
      locations: () => Location.find({ userId }).sort({ createdAt: -1 }),
      nav: () => Nav.find({ userId }).sort({ createdAt: -1 }),
      data: () => Data.find({ userId }).sort({ createdAt: -1 }),
      menu: () => Dish.find({ userId }).sort({ createdAt: -1 }), // Added for menu
      features: () => FeatureSection.find({ userId }), // Added for features
      reviews: () => Review.find({ userId }), // Added for reviews
      giftCards: () => GiftCard.find({ userId }), // Added for gift cards
    };

    let selectedSections;
    if (sections) {
      // Parse comma-separated list, trim whitespace, and filter valid keys
      selectedSections = sections
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => sectionMap[s]);
      if (selectedSections.length === 0) {
        return res.status(400).json({ error: "No valid sections provided" });
      }
    } else {
      // Default: all sections
      selectedSections = Object.keys(sectionMap);
    }

    // Fetch only the requested sections
    const results = await Promise.all(
      selectedSections.map((key) => sectionMap[key]())
    );
    // Build response object
    const response = {};
    selectedSections.forEach((key, idx) => {
      response[key] = results[idx];
    });
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

// GET: Retrieve all data for preview (section-wise)
router.get("/preview", async (req, res) => {
  try {
    const [heros, galleries, faqs, footers, locations, navs, datas] =
      await Promise.all([
        Hero.find().sort({ createdAt: -1 }),
        Gallery.find().sort({ createdAt: -1 }),
        FAQ.find().sort({ createdAt: -1 }),
        Footer.find().sort({ createdAt: -1 }),
        Location.find().sort({ createdAt: -1 }),
        Nav.find().sort({ createdAt: -1 }),
        Data.find().sort({ createdAt: -1 }),
      ]);
    res.json({
      hero: heros,
      gallery: galleries,
      faq: faqs,
      footer: footers,
      location: locations,
      nav: navs,
      data: datas,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
