import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create token function
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, countryCode, phone, password, referral } = req.body;

    if (!name?.trim() || !phone?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "name, phone, password required" });
    }

    const exist = await User.findOne({ phone: phone.trim() });

    if (exist) {
      return res.status(409).json({ message: "Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      name: name.trim(),
      countryCode: countryCode || "+880",
      phone: phone.trim(),
      password: hashedPassword,
      referral: referral?.trim() || "",
      provider: "local",
    });

    const token = createToken(user._id);

    // Save token in httpOnly cookie (secure, not readable by JS)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // JS-readable auth flag cookie (for ProtectedRoute / getToken)
    res.cookie("auth", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
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

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = createToken(user._id);

    // Save token in httpOnly cookie (secure, not readable by JS)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // JS-readable auth flag cookie (for ProtectedRoute / getToken)
    res.cookie("auth", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PROTECTED PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  try {
    return res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        phone: req.user.phone,
        countryCode: req.user.countryCode,
        referral: req.user.referral,
        role: req.user.role,
      },
    });
  } catch (err) {
    console.log("/me error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT — server must clear httpOnly cookies, JS cannot
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 0,
  });
  res.cookie("auth", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 0,
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

// GET SAVED PROPERTIES
router.get("/saved-properties", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedProperties",
      populate: { path: "postedBy", select: "name phone" },
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter to only return active properties, matching the feed behavior
    const activeSavedProperties = (user.savedProperties || []).filter(prop => prop.isActive);

    return res.status(200).json({ savedProperties: activeSavedProperties });
  } catch (err) {
    console.log("❌ Get saved properties error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// TOGGLE SAVE PROPERTY
router.post("/saved-properties/:propertyId", authMiddleware, async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle logic
    const index = user.savedProperties.indexOf(propertyId);
    let isSaved;
    if (index === -1) {
      // Add to array
      user.savedProperties.push(propertyId);
      isSaved = true;
    } else {
      // Remove from array
      user.savedProperties.splice(index, 1);
      isSaved = false;
    }

    await user.save();
    return res.status(200).json({ isSaved, savedProperties: user.savedProperties });
  } catch (err) {
    console.log("❌ Toggle saved property error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;