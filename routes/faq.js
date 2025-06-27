// FAQ section routes
const express = require("express");
const router = express.Router();
const FAQ = require("../models/FAQ");

// GET: Retrieve FAQ section for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const faq = await FAQ.findOne({ userId }).sort({ createdAt: -1 });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create FAQ section for a user
router.post("/", async (req, res) => {
  try {
    const { heading, questions, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const faq = new FAQ({ heading, questions, userId });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update FAQ section (by id) for a user
router.put("/:id", async (req, res) => {
  try {
    const { heading, questions, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const faq = await FAQ.findOneAndUpdate(
      { _id: req.params.id, userId },
      { heading, questions },
      { new: true }
    );
    if (!faq)
      return res.status(404).json({ error: "FAQ not found or not authorized" });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove FAQ section by id for a user
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const faq = await FAQ.findOneAndDelete({ _id: req.params.id, userId });
    if (!faq)
      return res.status(404).json({ error: "FAQ not found or not authorized" });
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH: Add a question to the FAQ section (by id) for a user
router.patch("/:id/add-question", async (req, res) => {
  try {
    const { question, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (!question || !question.title || !question.description) {
      return res
        .status(400)
        .json({ error: "Question with title and description is required" });
    }
    const faq = await FAQ.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $push: { questions: question } },
      { new: true }
    );
    if (!faq)
      return res.status(404).json({ error: "FAQ not found or not authorized" });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
