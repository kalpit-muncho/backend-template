// Footer section routes
const express = require("express");
const router = express.Router();
const Footer = require("../models/Footer");

// GET: Retrieve Footer section for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const footer = await Footer.findOne({ userId }).sort({ createdAt: -1 });
    res.json(footer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create Footer section for a user
router.post("/", async (req, res) => {
  try {
    const { links, legalLinks, socialLinks, madeWith, cta, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const footer = new Footer({
      links,
      legalLinks,
      socialLinks,
      madeWith,
      cta,
      userId,
    });
    await footer.save();
    res.status(201).json(footer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update Footer section (by id) for a user
router.put("/:id", async (req, res) => {
  try {
    const { links, legalLinks, socialLinks, madeWith, cta, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const footer = await Footer.findOneAndUpdate(
      { _id: req.params.id, userId },
      { links, legalLinks, socialLinks, madeWith, cta },
      { new: true }
    );
    if (!footer)
      return res
        .status(404)
        .json({ error: "Footer not found or not authorized" });
    res.json(footer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove Footer section by id for a user
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const footer = await Footer.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!footer)
      return res
        .status(404)
        .json({ error: "Footer not found or not authorized" });
    res.json({ message: "Footer deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
