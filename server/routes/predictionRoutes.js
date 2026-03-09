const express = require("express");
const { 
  predictSymptoms,
  predictReport,
  getHistory,
  getRecord,
  deleteRecord,
  getSymptomsList, // Add this
  checkHealth      // Add this
} = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Health check route for the frontend status indicator
router.get("/health", checkHealth);

// Route to fetch the symptoms list from the ML service
router.get("/symptoms", getSymptomsList);

router.post("/symptoms", protect, predictSymptoms);
router.post("/report", protect, predictReport);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getRecord);
router.delete("/:id", protect, deleteRecord);

module.exports = router;