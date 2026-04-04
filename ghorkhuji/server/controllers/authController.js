import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hashedPassword });
    return res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.log("❌ Register error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ httpOnly cookie — secure, JS দিয়ে পড়া যাবে না
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ আলাদা non-httpOnly cookie — JS দিয়ে পড়া যাবে (ProtectedRoute এর জন্য)
    res.cookie("auth", "true", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.log("❌ Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 0 });
  res.cookie("auth", "", { httpOnly: false, secure: false, sameSite: "lax", maxAge: 0 });
  return res.status(200).json({ message: "Logged out successfully" });
};