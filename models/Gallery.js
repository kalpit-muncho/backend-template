// Gallery section model
const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  images: [
    {
      src: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true }, // Associate gallery with a user
  sectionId: { type: String, required: true }, // Unique section instance
});

module.exports = mongoose.model("Gallery", GallerySchema);
