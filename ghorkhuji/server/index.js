import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // ✅ এটা add করতে হবে
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(express.json()); // JSON প্যারসিং

// ✅ cookieParser must be before routes
app.use(cookieParser());

// CORS কনফিগারেশন
app.use(
  cors({
    origin: CLIENT_URL, // ফ্রন্টএন্ড URL
    credentials: true, // ✅ cookies allow করার জন্য
  })
);

// রুট
app.get("/", (req, res) => {
  res.send("API running ✅");
});

app.use("/api/auth", authRoutes); // authRoutes নিয়ে আসা

// MongoDB কনফিগারেশন
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });