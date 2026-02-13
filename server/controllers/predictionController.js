const HealthRecord = require("../models/HealthRecord");

// Dummy prediction logic (temporary)
exports.predictSymptoms = async (req, res) => {
  try {
    const { age, temperature, bp, symptoms } = req.body;

    // Basic validation
    if (!age || !temperature || !bp || !symptoms) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Dummy logic (we replace with ML later)
    let prediction = "Common Flu";
    let risk = temperature > 102 ? "High" : "Moderate";
    let probability = temperature > 102 ? 0.85 : 0.65;

    // Save to DB
    const record = await HealthRecord.create({
      user: req.user._id,
      age,
      temperature,
      bp,
      symptoms,
      prediction,
      risk,
      probability,
    });

    res.status(201).json({
      disease: prediction,
      risk,
      probability,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get user prediction history
exports.getHistory = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
