const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    bp: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    prediction: {
      type: String,
      required: true,
    },
    risk: {
      type: String,
      required: true,
    },
    probability: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
