// Hero section model
const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema({
  text: {
    title: { type: String, default: "" },
    heroText: { type: String, default: "" },
  },
  bg_image: {
    src: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true }, // Associate hero with a user
});

module.exports = mongoose.model("Hero", HeroSchema);
