const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    default: "Catering",
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  button: {
    type: String,
    default: "Arrange Your Fiesta!",
  },
  links: [
    {
      label: { type: String, required: true },
      href: { type: String, default: "" },
      enabled: { type: Boolean, default: true },
    },
  ],
});

module.exports = mongoose.model("Card", CardSchema);
