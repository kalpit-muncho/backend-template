const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

// Create or update card for a user
router.post("/", async (req, res) => {
  try {
    const { userId, title, description, image, button, links } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const card = await Card.findOneAndUpdate(
      { userId },
      { title, description, image, button, links, userId },
      { new: true, upsert: true }
    );
    res.status(200).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get card for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const card = await Card.findOne({ userId });
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update card for a user
router.put("/", async (req, res) => {
  try {
    const { userId, title, description, image, button, links } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const card = await Card.findOneAndUpdate(
      { userId },
      { title, description, image, button, links },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete card for a user
router.delete("/", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const result = await Card.findOneAndDelete({ userId });
    if (!result) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
