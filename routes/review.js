const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Get reviews by userId
router.get("/:userId", async (req, res) => {
  try {
    const reviewDoc = await Review.findOne({ userId: req.params.userId });
    if (!reviewDoc)
      return res.status(404).json({ message: "No reviews found" });
    res.json(reviewDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or replace reviews for a user
router.post("/:userId", async (req, res) => {
  try {
    const { reviews } = req.body;
    if (!Array.isArray(reviews))
      return res.status(400).json({ message: "Invalid reviews array" });
    const reviewDoc = await Review.findOneAndUpdate(
      { userId: req.params.userId },
      { userId: req.params.userId, reviews },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(reviewDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a single review by index for a user
router.put("/:userId/:index", async (req, res) => {
  try {
    const { name, review, rating } = req.body;
    const reviewDoc = await Review.findOne({ userId: req.params.userId });
    if (!reviewDoc)
      return res.status(404).json({ message: "No reviews found" });
    if (reviewDoc.reviews.length <= req.params.index)
      return res.status(400).json({ message: "Invalid review index" });
    reviewDoc.reviews[req.params.index] = { name, review, rating };
    await reviewDoc.save();
    res.json(reviewDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a single review by index for a user
router.delete("/:userId/:index", async (req, res) => {
  try {
    const reviewDoc = await Review.findOne({ userId: req.params.userId });
    if (!reviewDoc)
      return res.status(404).json({ message: "No reviews found" });
    if (reviewDoc.reviews.length <= req.params.index)
      return res.status(400).json({ message: "Invalid review index" });
    reviewDoc.reviews.splice(req.params.index, 1);
    await reviewDoc.save();
    res.json(reviewDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
