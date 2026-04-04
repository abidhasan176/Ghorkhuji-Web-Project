import mongoose from "mongoose";

// Order Schema — এটা define করে MongoDB-তে কোন order-এর data কীভাবে store হবে
// Order মানে — যে ভাড়া নিতে চায় সে তার চাহিদা দিয়ে post করে
const orderSchema = new mongoose.Schema(
  {
    // কোন user এই order post করেছে (User model এর reference)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Location — কোথায় বাসা চাই (single location support)
    locations: [
      {
        division: { type: String, required: true },
        district: { type: String, required: true },
        area: { type: String, required: true },
      },
    ],
    detailedAddress: { type: String, default: "" },

    // Primary Requirements
    category: { type: String, required: true },       // Family, Bachelor, Office, etc.
    gender: { type: String, required: true },         // Male/Female/Any
    room: { type: String, required: true },           // কতটা room দরকার
    bathroom: { type: String, required: true },       // কতটা bathroom দরকার
    needFrom: { type: String, required: true },       // কোন মাস থেকে দরকার
    maxBudget: { type: Number, required: true },      // সর্বোচ্চ বাজেট (BDT)

    // Additional Requirements (optional)
    kitchen: { type: String, default: "" },           // Kitchen facility
    gas: { type: String, default: "" },               // Gas facility
    livingSpace: { type: String, default: "" },       // Living space
    roomSharing: { type: String, default: "" },       // Room sharing
    floorPreference: { type: String, default: "" },   // Floor preference
    lift: { type: String, default: "" },              // Lift facility
    parking: { type: String, default: "" },           // Parking facility

    // Package & Payment
    packageDays: { type: Number, default: 7 },        // 7 দিনের package
    packagePrice: { type: Number, default: 1000 },    // 1,000 BDT
    agreedToTerms: { type: Boolean, default: false }, // Terms & Conditions agree

    // Order status
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // createdAt এবং updatedAt automatically add হবে
);

export default mongoose.model("Order", orderSchema);
