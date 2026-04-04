import dns from "dns";
// ✅ ISP-এর DNS ব্লকিং বাইপাস করার জন্য Google DNS ব্যবহার করা হচ্ছে
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(express.json());

// cookieParser must be before routes
app.use(cookieParser());

// CORS config
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("API running ✅");
});

app.use("/api/auth", authRoutes);           // Auth routes (login, register, logout)
app.use("/api/properties", propertyRoutes); // Property routes (AddProperty form)
app.use("/api/orders", orderRoutes);         // Order routes (OrderHome form)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { family: 4 }) // ✅ 'family: 4' যোগ করা হয়েছে IPv6 এরর বাইপাস করার জন্য
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });