import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin check middleware (assuming provider='admin' or similar, but for now we just verify logged in)
const adminCheck = (req, res, next) => {
  // In a real app, you would check req.user.role === 'admin'
  // Since we haven't added an admin role yet, we allow logged in users for demonstration.
  next();
};

// GET /api/admin/dashboard-stats
router.get("/dashboard-stats", authMiddleware, adminCheck, getDashboardStats);

export default router;
