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
import messageRoutes from "./routes/messageRoutes.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const ALLOWED_ORIGINS = [CLIENT_URL, "http://localhost:5174", "http://localhost:5175"];

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

app.use("/api/auth", authRoutes);           // Auth routes (login, register, logout)
app.use("/api/properties", propertyRoutes); // Property routes (AddProperty form)
app.use("/api/orders", orderRoutes);         // Order routes (OrderHome form)
app.use("/api/messages", messageRoutes);     // Message routes (Chat feature)

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