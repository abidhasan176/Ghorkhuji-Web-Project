import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    console.log("🔥 BACKEND HIT:", req.body);

    const { name, countryCode, phone, password, referral } = req.body;

    if (!name?.trim() || !phone?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "name, phone, password required" });
    }

    // phone duplicate check
    const exist = await User.findOne({ phone: phone.trim() });
    if (exist) {
      return res.status(409).json({ message: "Phone already registered" });
    }

    // 🔐 password hash
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      name: name.trim(),
      countryCode: countryCode || "+880",
      phone: phone.trim(),
      password: hashedPassword,
      referral: referral?.trim() || "",
    });

    return res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.log("❌ Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const user = await User.findOne({ phone: phone.trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 password compare
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });

  } catch (err) {
    console.log("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;