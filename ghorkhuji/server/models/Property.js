import mongoose from "mongoose";

// Property Schema — এটা define করে MongoDB-তে কোন property-র data কীভাবে store হবে
const propertySchema = new mongoose.Schema(
  {
    // কোন user এই property post করেছে (User model এর reference)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Information
    month: { type: String, required: true },         // কোন মাস থেকে available
    category: { type: String, required: true },       // Family, Bachelor, Office, etc.
    propertyType: { type: String, required: true },   // Flat, House, Room, etc.
    bedroom: { type: String, required: true },        // কতটা bedroom
    bathroom: { type: String, required: true },       // কতটা bathroom
    balcony: { type: String, default: "None" },       // balcony আছে কিনা
    floor: { type: String, default: "" },             // কত তলায়
    gender: { type: String, required: true },         // Male/Female/Any
    size: { type: String, default: "" },              // Square feet

    // Location Information
    division: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String, required: true },
    block: { type: String, default: "" },
    sectorNo: { type: String, default: "" },
    roadNo: { type: String, default: "" },
    houseNo: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    shortAddress: { type: String, required: true },

    // Additional Information
    details: { type: String, default: "" },           // Property description

    // Images — ছবির URL গুলো array হিসেবে store হবে
    images: [{ type: String }],

    // Price Information
    price: { type: Number, required: true },
    priceType: { type: String, default: "Monthly" },

    // Price includes (কোনগুলো bill included)
    includesElectricity: { type: Boolean, default: false },
    includesGas: { type: Boolean, default: false },
    includesWater: { type: Boolean, default: false },
    includesLift: { type: Boolean, default: false },
    includesSecurity: { type: Boolean, default: false },
    includesServant: { type: Boolean, default: false },  // Bachelor এর জন্য servant charge
    includesNet: { type: Boolean, default: false },       // Bachelor এর জন্য internet bill

    // Post status
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // createdAt এবং updatedAt automatically add হবে
);

export default mongoose.model("Property", propertySchema);
