require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Import and use routes
const dataRoutes = require("./routes/data");
const heroRoutes = require("./routes/hero");
const galleryRoutes = require("./routes/gallery");
const locationRoutes = require("./routes/location");
const faqRoutes = require("./routes/faq");
const footerRoutes = require("./routes/footer");
const navfooterRouter = require("./routes/navfooter");
const sectionListRoutes = require("./routes/sectionlist");
const featureSectionRoutes = require("./routes/featureSection");
const dishRouter = require("./routes/dish");
const reviewRouter = require("./routes/review");
const giftCardRouter = require("./routes/giftcard");
const appearanceRouter = require("./routes/appearance");
const cardRouter = require("./routes/card");
const googlePlacesRouter = require("./routes/googlePlaces");
const seoRouter = require("./routes/seo");

app.use("/api/data", dataRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api", navfooterRouter);
app.use("/api", sectionListRoutes);
app.use("/api/feature-section", featureSectionRoutes);
app.use("/api/dish", dishRouter);
app.use("/api/review", reviewRouter);
app.use("/api/giftcard", giftCardRouter);
app.use("/api/appearance", appearanceRouter);
app.use("/api/card", cardRouter);
app.use("/api/google-places", googlePlacesRouter);
app.use("/api", seoRouter);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("server live");
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
