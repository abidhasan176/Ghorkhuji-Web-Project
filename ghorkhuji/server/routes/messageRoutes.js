import express from "express";
import { sendMessage, getMessages, getConversations, getUnreadCount, markAsRead } from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

router.post("/send", sendMessage);
router.get("/conversations", getConversations);
router.get("/unread", getUnreadCount);
router.put("/mark-read/:senderId", markAsRead);
router.get("/:userId", getMessages);

export default router;
