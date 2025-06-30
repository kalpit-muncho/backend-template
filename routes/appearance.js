const express = require("express");
const router = express.Router();
const Appearance = require("../models/Appearance");

// Create or update appearance for a user
router.post("/", async (req, res) => {
  try {
    const { userId, logo } = req.body;
    if (!userId || !logo) {
      return res.status(400).json({ error: "userId and logo are required" });
    }
    // No ObjectId conversion, just use as string like other sections
    const appearance = await Appearance.findOneAndUpdate(
      { userId },
      { logo, userId },
      { new: true, upsert: true }
    );
    res.status(200).json(appearance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get appearance for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    // No ObjectId conversion, just use as string like other sections
    const appearance = await Appearance.findOne({ userId });
    if (!appearance) {
      return res.status(404).json({ error: "Appearance not found" });
    }
    res.json(appearance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update appearance for a user
router.put("/", async (req, res) => {
  try {
    const { userId, logo } = req.body;
    if (!userId || !logo) {
      return res.status(400).json({ error: "userId and logo are required" });
    }
    // No ObjectId conversion, just use as string like other sections
    const appearance = await Appearance.findOneAndUpdate(
      { userId },
      { logo },
      { new: true }
    );
    if (!appearance) {
      return res.status(404).json({ error: "Appearance not found" });
    }
    res.status(200).json(appearance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete appearance for a user
router.delete("/", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    // No ObjectId conversion, just use as string like other sections
    const result = await Appearance.findOneAndDelete({ userId });
    if (!result) {
      return res.status(404).json({ error: "Appearance not found" });
    }
    res.json({ message: "Appearance deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
