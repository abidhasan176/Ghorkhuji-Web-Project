import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API running ✅");
});

app.use("/api/auth", authRoutes);

// server আগে start হবে
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// DB পরে connect করার চেষ্টা করবে
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });