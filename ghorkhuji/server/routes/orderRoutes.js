import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================================
// POST /api/orders — নতুন order post করা (ভাড়াটিয়া করবে)
// authMiddleware — user logged in কিনা check করে
// ============================================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      locations,
      category, gender, room, bathroom, needFrom, maxBudget,
      kitchen, gas, livingSpace, roomSharing, floorPreference, lift, parking,
      agreedToTerms,
    } = req.body;

    // Required fields check
    if (!locations || locations.length === 0 || !category || !gender || !room || !bathroom || !needFrom || !maxBudget) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!agreedToTerms) {
      return res.status(400).json({ message: "You must agree to Terms & Conditions" });
    }

    // নতুন order তৈরি — postedBy তে logged in user-এর ID যাবে
    const order = await Order.create({
      postedBy: req.user._id,
      locations,
      category, gender, room, bathroom, needFrom,
      maxBudget,
      kitchen: kitchen || "",
      gas: gas || "",
      livingSpace: livingSpace || "",
      roomSharing: roomSharing || "",
      floorPreference: floorPreference || "",
      lift: lift || "",
      parking: parking || "",
      packageDays: 7,
      packagePrice: 1000,
      agreedToTerms,
    });

    return res.status(201).json({
      message: "Order posted successfully ✅",
      order,
    });
  } catch (err) {
    console.log("❌ Post order error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// GET /api/orders — সব order দেখা
// Public route — যে কেউ দেখতে পারবে
// ============================================================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name phone"); // poster এর name আর phone দেখাবে

    return res.status(200).json({ orders });
  } catch (err) {
    console.log("❌ Get orders error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// GET /api/orders/:id — একটা নির্দিষ্ট order দেখা
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("postedBy", "name phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    console.log("❌ Get order error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// DELETE /api/orders/:id — নিজের order delete করা
// ============================================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // শুধু যে post করেছে সেই delete করতে পারবে
    if (order.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await order.deleteOne();
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.log("❌ Delete order error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
