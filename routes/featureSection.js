const express = require("express");
const router = express.Router();
const FeatureSection = require("../models/FeatureSection");

// Get features for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const section = await FeatureSection.findOne({ userId });
    if (!section) return res.status(404).json({ features: [] });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update or create features for a user
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { features } = req.body;
    let section = await FeatureSection.findOneAndUpdate(
      { userId },
      { features },
      { new: true, upsert: true }
    );
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
