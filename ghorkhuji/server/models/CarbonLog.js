import mongoose from "mongoose";

const carbonLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    bytesTransferred: {
      type: Number,
      required: true,
    },
    co2Emissions: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CarbonLog = mongoose.model("CarbonLog", carbonLogSchema);
export default CarbonLog;
