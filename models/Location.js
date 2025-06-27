// Location section model
const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  mapQuery: { type: String, required: true },
  enabled: { type: Boolean, default: true }, // Add enabled field for show/hide
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true }, // Associate location with a user
});

module.exports = mongoose.model("Locations", LocationSchema);
