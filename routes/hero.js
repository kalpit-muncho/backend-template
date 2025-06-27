// Hero section routes
const express = require("express");
const router = express.Router();
const Hero = require("../models/Hero");

// GET: Retrieve hero section for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const hero = await Hero.findOne({ userId }).sort({ createdAt: -1 });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create hero section for a user
router.post("/", async (req, res) => {
  try {
    const { text, bg_image, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const hero = new Hero({ text, bg_image, userId });
    await hero.save();
    res.status(201).json(hero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update hero section (by id) for a user
router.put("/:id", async (req, res) => {
  try {
    const { text, bg_image, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const hero = await Hero.findOneAndUpdate(
      { _id: req.params.id, userId },
      { text, bg_image },
      { new: true }
    );
    if (!hero)
      return res
        .status(404)
        .json({ error: "Hero not found or not authorized" });
    res.json(hero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove hero section by id for a user
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const hero = await Hero.findOneAndDelete({ _id: req.params.id, userId });
    if (!hero)
      return res
        .status(404)
        .json({ error: "Hero not found or not authorized" });
    res.json({ message: "Hero deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
