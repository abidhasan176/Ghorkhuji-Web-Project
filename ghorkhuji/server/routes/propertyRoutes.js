import express from "express";
import Property from "../models/Property.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ============================================================
// POST /api/properties — নতুন property post করা (Malik করবে)
// authMiddleware দিয়ে check করা হচ্ছে user logged in কিনা
// upload.array("images", 5) — সর্বোচ্চ 5 টা ছবি allow করা হবে
// ============================================================
router.post("/", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const {
      month, category, propertyType, bedroom, bathroom,
      balcony, floor, gender, size,
      division, district, area, block, sectorNo, roadNo, houseNo, postalCode, shortAddress,
      details,
      price, priceType,
      includesElectricity, includesGas, includesWater, includesLift, includesSecurity,
      includesServant, includesNet,
    } = req.body;

    // Required fields check
    if (!month || !category || !propertyType || !bedroom || !bathroom || !gender || !division || !district || !area || !shortAddress || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Cloudinary-তে ছবিগুলো আপলোড করা
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Buffer থেকে Data URI তৈরি করা
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;

        try {
          const cloudRes = await cloudinary.uploader.upload(dataURI, {
            folder: "ghorkhuji_properties", // ফোল্ডারের নাম
          });
          uploadedImages.push(cloudRes.secure_url);
        } catch (uploadErr) {
          console.log("❌ Cloudinary upload error:", uploadErr.message);
        }
      }
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
      images: uploadedImages, // Cloudinary থেকে পাওয়া URL-গুলো সেভ হচ্ছে
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
// GET /api/properties/search —property search
// ============================================================
router.get("/search", async (req, res) => {
  try {
    const { query, category, maxBudget, propertyType } = req.query;

    let filter = { isActive: true };

    if (category && category !== "All") {
       filter.category = category;
    }

    if (propertyType && propertyType !== "All") {
       filter.propertyType = propertyType;
    }

    if (maxBudget) {
       filter.price = { $lte: Number(maxBudget) };
    }

    if (query) {
      // Create a regex to match the search term case-insensitively in area, district, division, shortAddress
      const regex = new RegExp(query, "i");
      filter.$or = [
        { area: regex },
        { district: regex },
        { division: regex },
        { shortAddress: regex }
      ];
    }

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name phone");

    return res.status(200).json({ properties });
  } catch (err) {
    console.log("❌ Search properties error:", err.message);
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
