// Gallery section routes
const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");

// GET: Retrieve gallery section for a user and sectionId
router.get("/", async (req, res) => {
  try {
    const { userId, sectionId } = req.query;
    if (!userId || !sectionId)
      return res
        .status(400)
        .json({ error: "userId and sectionId are required" });
    const gallery = await Gallery.findOne({ userId, sectionId });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create or update gallery section for a user and sectionId
router.post("/", async (req, res) => {
  try {
    const { title, subtitle, images, userId, sectionId } = req.body;
    if (!userId || !sectionId)
      return res
        .status(400)
        .json({ error: "userId and sectionId are required" });
    let gallery = await Gallery.findOneAndUpdate(
      { userId, sectionId },
      { title, subtitle, images },
      { new: true }
    );
    if (!gallery) {
      gallery = new Gallery({ title, subtitle, images, userId, sectionId });
      await gallery.save();
    }
    res.status(201).json(gallery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update gallery section (by id) for a user and sectionId
router.put("/:id", async (req, res) => {
  try {
    const { title, subtitle, images, userId, sectionId } = req.body;
    if (!userId || !sectionId)
      return res
        .status(400)
        .json({ error: "userId and sectionId are required" });
    const gallery = await Gallery.findOneAndUpdate(
      { _id: req.params.id, userId, sectionId },
      { title, subtitle, images },
      { new: true }
    );
    if (!gallery)
      return res
        .status(404)
        .json({ error: "Gallery not found or not authorized" });
    res.json(gallery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove gallery section by id for a user and sectionId
router.delete("/:id", async (req, res) => {
  try {
    const { userId, sectionId } = req.body;
    if (!userId || !sectionId)
      return res
        .status(400)
        .json({ error: "userId and sectionId are required" });
    const gallery = await Gallery.findOneAndDelete({
      _id: req.params.id,
      userId,
      sectionId,
    });
    if (!gallery)
      return res
        .status(404)
        .json({ error: "Gallery not found or not authorized" });
    res.json({ message: "Gallery deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove an image from gallery by image index
router.delete("/:galleryId/image/:imageIdx", async (req, res) => {
  try {
    const { galleryId, imageIdx } = req.params;
    const gallery = await Gallery.findById(galleryId);
    if (!gallery) return res.status(404).json({ error: "Gallery not found" });
    if (
      !gallery.images ||
      isNaN(imageIdx) ||
      imageIdx < 0 ||
      imageIdx >= gallery.images.length
    ) {
      return res.status(400).json({ error: "Invalid image index" });
    }
    gallery.images.splice(imageIdx, 1);
    await gallery.save();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
