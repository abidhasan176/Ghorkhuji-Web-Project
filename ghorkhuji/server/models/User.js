import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, default: "+880" },
    phone: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    referral: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);