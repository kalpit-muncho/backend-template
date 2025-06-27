const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: false },
  enabled: { type: Boolean, default: true },
});

const NavSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    links: [
      {
        title: { type: String, required: true },
        link: { type: String, required: false },
        enabled: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

const FooterSchema = new mongoose.Schema(
  {
    links: [LinkSchema],
    legalLinks: [LinkSchema],
  },
  { timestamps: true }
);

module.exports = {
  Nav: mongoose.models.Nav || mongoose.model("Nav", NavSchema),
  Footer: mongoose.models.Footer || mongoose.model("Footer", FooterSchema),
};
