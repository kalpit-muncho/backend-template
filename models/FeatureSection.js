const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
  iconName: { type: String, required: true },
  label: { type: String, required: true },
});

const FeatureSectionSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  features: [FeatureSchema],
});

module.exports = mongoose.model("FeatureSection", FeatureSectionSchema);
