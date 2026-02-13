const express = require("express");
const { predictSymptoms, getHistory } = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/symptoms", protect, predictSymptoms);
router.get("/history", protect, getHistory);

module.exports = router;
