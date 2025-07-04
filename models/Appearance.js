const mongoose = require("mongoose");

const AppearanceSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed from ObjectId to String
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  metaTitle: {
    type: String,
    default: "",
  },
  metaDescription: {
    type: String,
    default: "",
  },
  metaUpdatedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Appearance", AppearanceSchema);
