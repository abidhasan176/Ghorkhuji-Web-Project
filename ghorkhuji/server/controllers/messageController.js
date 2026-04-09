import Message from "../models/Message.js";
import User from "../models/User.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, propertyId } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver ID and text are required." });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      propertyId,
      text,
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get messages between logged-in user and a specific user
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // The other user
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all unique users the logged-in user has chatted with
export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    }).sort({ createdAt: -1 });

    // Extract unique user IDs and count unread messages
    const userIds = new Set();
    const unreadMap = {};

    messages.forEach((msg) => {
      // If receiver is current user and message is unread, increase count for the sender
      if (msg.receiverId.toString() === currentUserId.toString() && !msg.isRead) {
        unreadMap[msg.senderId.toString()] = (unreadMap[msg.senderId.toString()] || 0) + 1;
      }

      if (msg.senderId.toString() !== currentUserId.toString()) {
        userIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== currentUserId.toString()) {
        userIds.add(msg.receiverId.toString());
      }
    });

    const uniqueUserIds = Array.from(userIds);

    // Fetch user details for those IDs
    const users = await User.find({ _id: { $in: uniqueUserIds } }).select("name email phone").lean();

    const conversations = users.map(user => ({
      ...user,
      unreadCount: unreadMap[user._id.toString()] || 0
    }));

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get total unread messages count for the logged in user
export const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiverId: currentUserId,
      isRead: false
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Mark messages from a specific sender to the logged in user as read
export const markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const currentUserId = req.user._id;

    await Message.updateMany(
      { senderId: senderId, receiverId: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking as read:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
