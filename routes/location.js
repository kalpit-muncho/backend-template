// Location section routes
const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// GET: Retrieve all locations for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const locations = await Location.find({ userId }).sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new location for a user
router.post("/", async (req, res) => {
  try {
    const { name, city, address, phone, email, mapQuery, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const location = new Location({
      name,
      city,
      address,
      phone,
      email,
      mapQuery,
      userId,
    });
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update a location by id for a user
router.put("/:id", async (req, res) => {
  try {
    const { name, city, address, phone, email, mapQuery, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    // Only update if the location belongs to the user
    const location = await Location.findOneAndUpdate(
      { _id: req.params.id, userId },
      { name, city, address, phone, email, mapQuery },
      { new: true }
    );
    if (!location)
      return res
        .status(404)
        .json({ error: "Location not found or not authorized" });
    res.json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a location by id for a user
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    // Only delete if the location belongs to the user
    const location = await Location.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!location)
      return res
        .status(404)
        .json({ error: "Location not found or not authorized" });
    res.json({ message: "Location deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
