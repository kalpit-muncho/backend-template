const mongoose = require("mongoose");

const GiftCardSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
});

module.exports = mongoose.model("GiftCard", GiftCardSchema);
