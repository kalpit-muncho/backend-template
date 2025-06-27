const express = require("express");
const router = express.Router();
const GiftCard = require("../models/GiftCard");

// Get GiftCard details for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const giftCard = await GiftCard.findOne({ userId });
    res.json(giftCard);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gift card details" });
  }
});

// Save or update GiftCard details for a user
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, img } = req.body;
    let giftCard = await GiftCard.findOne({ userId });
    if (giftCard) {
      giftCard.title = title;
      giftCard.description = description;
      giftCard.img = img;
      await giftCard.save();
    } else {
      giftCard = new GiftCard({ userId, title, description, img });
      await giftCard.save();
    }
    res.json(giftCard);
  } catch (err) {
    res.status(500).json({ error: "Failed to save gift card details" });
  }
});

module.exports = router;
