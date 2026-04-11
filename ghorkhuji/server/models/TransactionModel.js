import mongoose from "mongoose";

// Transaction Schema — পেমেন্টের সব রেকর্ড এখানে সেভ হবে
// User এবং Property এর সাথে লিংক করা আছে
const transactionSchema = new mongoose.Schema(
  {
    // কোন user পেমেন্ট করছে
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // কোন property-র জন্য advance booking
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    // SSLCommerz থেকে আসা unique transaction ID
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    // পেমেন্টের পরিমাণ (BDT)
    amount: {
      type: Number,
      required: true,
    },

    // পেমেন্টের বর্তমান অবস্থা
    status: {
      type: String,
      enum: ["pending", "success", "fail", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true } // createdAt এবং updatedAt automatically add হবে
);

export default mongoose.model("Transaction", transactionSchema);
