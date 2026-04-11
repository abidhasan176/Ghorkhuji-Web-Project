import express from "express";
import CarbonLog from "../models/CarbonLog.js";

const router = express.Router();

// POST /api/carbon-log
// Create a new carbon log entry from the frontend tracking
router.post("/", async (req, res) => {
  try {
    const { userId, bytesTransferred, co2Emissions } = req.body;
    const log = new CarbonLog({
      userId: userId || undefined,
      bytesTransferred: bytesTransferred || 0,
      co2Emissions: co2Emissions || 0,
    });
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error("Error saving carbon log:", error);
    res.status(500).json({ error: "Failed to save carbon log" });
  }
});

// GET /api/carbon-log
// Retrieve carbon log entries sorted by latest first
router.get("/", async (req, res) => {
  try {
    const logs = await CarbonLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching carbon logs:", error);
    res.status(500).json({ error: "Failed to fetch carbon logs" });
  }
});

export default router;
