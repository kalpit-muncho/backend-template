const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

// Add one or multiple dishes for a user (userId can be any string)
router.post("/add", async (req, res) => {
  try {
    const { userId, dishes } = req.body;
    if (!userId || !Array.isArray(dishes) || dishes.length === 0) {
      return res
        .status(400)
        .json({ message: "userId and dishes array are required." });
    }
    // Validate each dish
    for (const dish of dishes) {
      if (!dish.dishId || !dish.name) {
        return res
          .status(400)
          .json({ message: "Each dish must have dishId and name." });
      }
    }
    // Upsert all dishes (remove ObjectId type restriction)
    const results = await Promise.all(
      dishes.map((dish) =>
        Dish.findOneAndUpdate(
          { userId: userId, dishId: dish.dishId },
          {
            name: dish.name,
            description: dish.description,
            imageUrl: dish.imageUrl,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );
    res.json({ status: true, data: results });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

// Get all dishes for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const dishes = await Dish.find({ userId: req.params.userId });
    res.json({ status: true, data: dishes });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

// Delete a dish for a user (delete only one dish, not all)
router.delete("/user/:userId/:dishId", async (req, res) => {
  try {
    const { userId, dishId } = req.params;
    const result = await Dish.deleteOne({
      userId: userId,
      dishId: Number(dishId),
    });
    if (result.deletedCount === 1) {
      res.json({ status: true, message: "Dish deleted" });
    } else {
      res.status(404).json({ status: false, message: "Dish not found" });
    }
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
