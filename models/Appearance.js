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
});

module.exports = mongoose.model("Appearance", AppearanceSchema);
