const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    required: false,
  },
  reviews: [
    {
      name: { type: String, required: true },
      review: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
    },
  ],
});

ReviewSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
