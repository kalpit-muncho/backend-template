const express = require("express");
const router = express.Router();
const SectionList = require("../models/SectionList");

// GET: Fetch section list for a user
router.get("/sectionlist", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });
  let doc = await SectionList.findOne({ userId });
  if (!doc) {
    doc = await SectionList.create({ userId, sections: [] });
  }
  // Sort sections by priority before returning
  const sortedSections = [...doc.sections].sort(
    (a, b) => a.priority - b.priority
  );
  res.json({ sections: sortedSections });
});

// POST: Save/update section list for a user
router.post("/sectionlist", async (req, res) => {
  const { userId, sections } = req.body;
  if (!userId || !Array.isArray(sections)) {
    return res
      .status(400)
      .json({ error: "userId and sections array are required" });
  }
  // Ensure priorities are correct before saving
  const prioritizedSections = sections.map((section, idx) => ({
    ...section,
    priority: idx,
  }));
  let doc = await SectionList.findOneAndUpdate(
    { userId },
    { sections: prioritizedSections, updatedAt: new Date() },
    { new: true, upsert: true }
  );
  // Sort sections by priority before returning
  const sortedSections = [...doc.sections].sort(
    (a, b) => a.priority - b.priority
  );
  res.json({ message: "Sections updated", sections: sortedSections });
});

module.exports = router;
