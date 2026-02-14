require("dotenv").config();

const express = require("express");
//const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const rateLimit = require("express-rate-limit");
//render k liye



//dotenv.config();
//temp check
//console.log("MONGO_URI:", process.env.MONGO_URI);

connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

//limiter chat
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each user to 20 requests per window
  message: {
    reply: "Too many AI requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/predict", require("./routes/predictionRoutes"));

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", aiLimiter,chatRoutes);


app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
