import express from "express";
import Property from "../models/Property.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================================
// POST /api/properties — নতুন property post করা (Malik করবে)
// authMiddleware দিয়ে check করা হচ্ছে user logged in কিনা
// ============================================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      month, category, propertyType, bedroom, bathroom,
      balcony, floor, gender, size,
      division, district, area, block, sectorNo, roadNo, houseNo, postalCode, shortAddress,
      details, images,
      price, priceType,
      includesElectricity, includesGas, includesWater, includesLift, includesSecurity,
      includesServant, includesNet,
    } = req.body;

    // Required fields check
    if (!month || !category || !propertyType || !bedroom || !bathroom || !gender || !division || !district || !area || !shortAddress || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // নতুন property তৈরি — postedBy তে logged in user-এর ID যাবে
    const property = await Property.create({
      postedBy: req.user._id,
      month, category, propertyType, bedroom, bathroom,
      balcony: balcony || "None",
      floor: floor || "",
      gender, size: size || "",
      division, district, area,
      block: block || "",
      sectorNo: sectorNo || "",
      roadNo: roadNo || "",
      houseNo: houseNo || "",
      postalCode: postalCode || "",
      shortAddress,
      details: details || "",
      images: images || [],
      price,
      priceType: priceType || "Monthly",
      includesElectricity: includesElectricity || false,
      includesGas: includesGas || false,
      includesWater: includesWater || false,
      includesLift: includesLift || false,
      includesSecurity: includesSecurity || false,
      includesServant: includesServant || false,
      includesNet: includesNet || false,
    });

    return res.status(201).json({
      message: "Property posted successfully ✅",
      property,
    });
  } catch (err) {
    console.log("❌ Post property error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// GET /api/properties — সব property দেখা (Home page এ listing)
// Public route — login ছাড়াও দেখা যাবে
// ============================================================
router.get("/", async (req, res) => {
  try {
    // সব active property নিয়ে আসো, newest first
    const properties = await Property.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name phone"); // poster এর name আর phone দেখাবে

    return res.status(200).json({ properties });
  } catch (err) {
    console.log("❌ Get properties error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// GET /api/properties/:id — একটা নির্দিষ্ট property দেখা
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("postedBy", "name phone");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({ property });
  } catch (err) {
    console.log("❌ Get property error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ============================================================
// DELETE /api/properties/:id — নিজের property delete করা
// ============================================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // শুধু যে post করেছে সেই delete করতে পারবে
    if (property.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await property.deleteOne();
    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.log("❌ Delete property error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
