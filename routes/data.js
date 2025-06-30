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
    response.appearance = appearance;
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
module.exports = router;
