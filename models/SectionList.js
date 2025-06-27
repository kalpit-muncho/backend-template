const mongoose = require("mongoose");

const SectionListSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  sections: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      isLocked: { type: Boolean, default: false },
      section: { type: String, required: true },
      priority: { type: Number, required: true },
      // Add more fields as needed
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SectionList", SectionListSchema);
