import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("🔥 BACKEND HIT:", req.body);

    const { name, countryCode, phone, password, referral } = req.body;

    if (!name?.trim() || !phone?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "name, phone, password required" });
    }

    // phone duplicate check
    const exist = await User.findOne({ phone: phone.trim() });
    if (exist) return res.status(409).json({ message: "Phone already registered" });

    const user = await User.create({
      name: name.trim(),
      countryCode: countryCode || "+880",
      phone: phone.trim(),
      password: password.trim(), // পরে hash করবো
      referral: referral?.trim() || "",
    });

    return res.status(201).json({
      message: "User saved in DB ✅",
      user: { id: user._id, name: user.name, phone: user.phone },
    });
  } catch (err) {
    console.log("❌ Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;