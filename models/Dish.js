const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Allow any string, not just ObjectId
      required: true,
      index: true,
    },
    dishId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Ensure uniqueness per user and dish
DishSchema.index({ userId: 1, dishId: 1 }, { unique: true });

module.exports = mongoose.model("Dish", DishSchema);
