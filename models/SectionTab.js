const mongoose = require("mongoose");

const SectionTabSchema = new mongoose.Schema({
  id: { type: String, required: true }, // removed unique: true
  name: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
  section: { type: String, required: true },
  priority: { type: Number, required: true },
  // You can add more fields as needed for each section type
});

const SectionTabsSetSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Now required for multi-user
  sectionTabs: [SectionTabSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SectionTabsSet", SectionTabsSetSchema);
