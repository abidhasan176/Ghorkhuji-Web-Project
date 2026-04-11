import dns from "dns";
// ✅ ISP-এর DNS ব্লকিং বাইপাস করার জন্য Google DNS ব্যবহার করা হচ্ছে
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const ALLOWED_ORIGINS = [CLIENT_URL, "http://localhost:5174", "http://localhost:5175"];

// ─────────────────────────────────────────────
// ① Morgan — HTTP Request Logger
// প্রতিটা API call terminal এ log করে দেখায়
// যেমন: GET /api/properties 200 23ms
// ─────────────────────────────────────────────
app.use(morgan("dev"));

// ─────────────────────────────────────────────
// ② Helmet — Security Headers
// Clickjacking, XSS, MIME sniffing এর মতো
// সাধারণ web attack থেকে সার্ভার রক্ষা করে
// ─────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ─────────────────────────────────────────────
// ③ Rate Limiting — Brute Force Protection
// Login/Register এ ৫ মিনিটে সর্বোচ্চ ১০ বার try
// বেশি চেষ্টা করলে 429 Too Many Requests দেবে
// ─────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  message: { message: "Too many attempts. Please wait 5 minutes and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json());

// cookieParser must be before routes
app.use(cookieParser());

// CORS config
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("API running ✅");
});

app.use("/api/auth", authLimiter, authRoutes); // Auth routes — Rate Limited
app.use("/api/properties", propertyRoutes);    // Property routes
app.use("/api/orders", orderRoutes);            // Order routes
app.use("/api/messages", messageRoutes);        // Message routes
app.use("/api/payment", paymentRoutes);         // Payment routes
app.use("/api/admin", adminRoutes);             // Admin Analytics routes

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  },
});

// Map to store connected users (userId -> socketId)
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user logs in / connects, they emit their user ID
  socket.on("addUser", (userId) => {
    connectedUsers.set(userId, socket.id);
  });

  // Handle sending message
  socket.on("sendMessage", ({ senderId, receiverId, text, propertyId }) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      // Send real-time message to receiver
      io.to(receiverSocketId).emit("getMessage", {
        senderId,
        text,
        propertyId,
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ④ Global Error Handler — সব Unhandled Error এখানে আসবে
// প্রতিটা route এ আলাদা করে 500 error না দিলেও এটা কভার করবে
// ─────────────────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { family: 4 }) // ✅ 'family: 4' যোগ করা হয়েছে IPv6 এরর বাইপাস করার জন্য
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
  });