const HealthRecord = require("../models/HealthRecord");
const axios = require("axios");

exports.predictSymptoms = async (req, res) => {
  try {
    const { features } = req.body;

    // Validate
    if (!features || !Array.isArray(features) || features.length !== 25) {
      return res.status(400).json({
        message: "Exactly 25 normalized features are required",
      });
    }

    // Call ML API
    const mlResponse = await axios.post(
      "https://health-api-oo87.onrender.com/predict",
      { features }
    );

    const { prediction, probability } = mlResponse.data;

    // Risk logic based on probability
    const risk =
      probability > 0.8 ? "High" :
      probability > 0.5 ? "Moderate" :
      "Low";

    // Save to DB
    const record = await HealthRecord.create({
      user: req.user._id,
      features,
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
    console.error("ML Prediction Error:", error.message);
    res.status(500).json({ message: "Prediction failed" });
  }
};
