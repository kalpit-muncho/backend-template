require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ CORS setup - must be placed early
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // needed if using cookies or HTTP auth
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests for all routes
app.options("*", cors());

// ✅ Parse JSON body
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("server live");
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
