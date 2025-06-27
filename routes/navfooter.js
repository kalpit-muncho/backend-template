const express = require("express");
const router = express.Router();
const { Nav, Footer } = require("../models/NavFooter");

// NAV ROUTES
router.get("/nav", async (req, res) => {
  try {
    const nav = await Nav.findOne();
    res.json(nav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/nav/:userId", async (req, res) => {
  try {
    const nav = await Nav.findOne({ userId: req.params.userId });
    if (!nav)
      return res
        .status(404)
        .json({ error: "Navigation not found for this user" });
    res.json(nav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/nav", async (req, res) => {
  try {
    const { userId, ...rest } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const nav = new Nav({ ...rest, userId });
    await nav.save();
    res.status(201).json(nav);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/nav/:id", async (req, res) => {
  try {
    const nav = await Nav.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(nav);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FOOTER ROUTES
router.get("/footer", async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.json(footer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/footer", async (req, res) => {
  try {
    const { userId, ...rest } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const footer = new Footer({ ...rest, userId });
    await footer.save();
    res.status(201).json(footer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/footer/:id", async (req, res) => {
  try {
    const footer = await Footer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(footer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
