// FAQ section model
const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
  heading: {
    title: { type: String, default: "" },
  },
  questions: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  userId: { type: String, required: true }, // Associate FAQ with a user
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FAQ", FAQSchema);