const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const GOOGLE_MAPS_API_KEY = "AIzaSyBro-x_mhnoEVugwlwGYrh54L4k8SabY7A";

// POST /api/google-places
// Body: { query: string }
router.post("/", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Missing query" });
  if (!GOOGLE_MAPS_API_KEY)
    return res.status(500).json({ message: "Missing Google Maps API key" });
  try {
    // 1. Find place_id
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      query
    )}&inputtype=textquery&fields=place_id&key=${GOOGLE_MAPS_API_KEY}`;
    const findRes = await fetch(findPlaceUrl);
    const findData = await findRes.json();
    if (!findData.candidates || !findData.candidates[0]?.place_id) {
      return res.status(404).json({ message: "No place found" });
    }
    const placeId = findData.candidates[0].place_id;
    // 2. Get details & reviews
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${GOOGLE_MAPS_API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();
    if (detailsData.status !== "OK") {
      return res.status(500).json({ message: "Could not fetch place details" });
    }
    return res.json(detailsData.result);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error searching place", error: err.message });
  }
});

module.exports = router;
