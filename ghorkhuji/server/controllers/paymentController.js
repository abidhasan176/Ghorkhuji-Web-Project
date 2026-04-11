import { Types } from "mongoose";
import SSLCommerzPayment from "sslcommerz-lts";
import Transaction from "../models/TransactionModel.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

// SSLCommerz configuration from environment variables
const SSL_IS_LIVE = process.env.SSL_IS_LIVE === "true";
const SSL_STORE_ID = process.env.SSL_STORE_ID;
const SSL_STORE_PASSWORD = process.env.SSL_STORE_PASSWORD;
const API_BASE_URL = process.env.API_BASE_URL; // Must be a public URL for SSLCommerz webhooks
const CLIENT_URL = process.env.CLIENT_URL;     // Frontend URL for redirects

// Advance booking fee in BDT — change this value anytime
const ADVANCE_BOOKING_AMOUNT = 500;

// ============================================================
// POST /api/payment/initiate/:propertyId
// Initiates an advance booking payment for a property
// ============================================================
export const initiatePayment = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // 1. Validate SSLCommerz credentials are configured
    if (!SSL_STORE_ID || !SSL_STORE_PASSWORD) {
      return res.status(500).json({
        message: "Payment gateway is not configured. Contact admin.",
      });
    }

    // 2. Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 3. Get user details for the payment form
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Generate a unique transaction ID
    const tranId = new Types.ObjectId().toString();

    // 5. Build SSLCommerz payment data
    const data = {
      total_amount: ADVANCE_BOOKING_AMOUNT,
      currency: "BDT",
      tran_id: tranId,

      // Webhook URLs — SSLCommerz will POST to these after payment
      success_url: `${API_BASE_URL}/api/payment/success/${tranId}`,
      fail_url:    `${API_BASE_URL}/api/payment/fail/${tranId}`,
      cancel_url:  `${API_BASE_URL}/api/payment/cancel/${tranId}`,

      // Product info
      shipping_method: "NO",
      product_name: `Advance Booking - ${property.shortAddress}`,
      product_category: "Real Estate",
      product_profile: "general",

      // Customer info from user account
      cus_name:     user.name,
      cus_email:    user.email || "customer@ghorkhuji.com",
      cus_add1:     property.shortAddress,
      cus_add2:     property.area || "N/A",
      cus_city:     property.district || "Dhaka",
      cus_state:    property.division || "Dhaka",
      cus_postcode: property.postalCode || "1000",
      cus_country:  "Bangladesh",
      cus_phone:    user.phone || "01700000000",
      cus_fax:      user.phone || "01700000000",

      // Shipping info (same as customer for digital booking)
      ship_name:     user.name,
      ship_add1:     property.shortAddress,
      ship_add2:     property.area || "N/A",
      ship_city:     property.district || "Dhaka",
      ship_state:    property.division || "Dhaka",
      ship_postcode: property.postalCode || "1000",
      ship_country:  "Bangladesh",
    };

    // 6. Initialize SSLCommerz payment
    const sslcz = new SSLCommerzPayment(SSL_STORE_ID, SSL_STORE_PASSWORD, SSL_IS_LIVE);
    const apiResponse = await sslcz.init(data);

    // 7. Check if payment initiation was successful
    if (apiResponse?.status === "FAILED") {
      return res.status(500).json({
        message: "Payment initiation failed. Please try again.",
      });
    }

    const gatewayPageURL = apiResponse.GatewayPageURL;

    // 8. Save a pending transaction to the database
    await Transaction.create({
      userId:        user._id,
      propertyId:    property._id,
      transactionId: tranId,
      amount:        ADVANCE_BOOKING_AMOUNT,
      status:        "pending",
    });

    // 9. Return the payment URL to the frontend
    return res.status(200).json({ paymentUrl: gatewayPageURL });

  } catch (err) {
    console.error("❌ Payment initiation error:", err.message);
    return res.status(500).json({ message: "Server error during payment initiation" });
  }
};

// ============================================================
// POST /api/payment/success/:tranId
// Called by SSLCommerz webhook after successful payment
// ============================================================
export const successPayment = async (req, res) => {
  try {
    const { tranId } = req.params;

    // Update transaction status to 'success'
    await Transaction.findOneAndUpdate(
      { transactionId: tranId },
      { status: "success" }
    );

    // Redirect user to the frontend success page using JS to prevent cross-site POST cookie drop
    return res.send(`<html><body><script>window.location.href="${CLIENT_URL}/payment-success";</script></body></html>`);
  } catch (err) {
    console.error("❌ Success payment webhook error:", err.message);
    return res.send(`<html><body><script>window.location.href="${CLIENT_URL}/payment-fail";</script></body></html>`);
  }
};

// ============================================================
// POST /api/payment/fail/:tranId
// Called by SSLCommerz webhook on payment failure
// ============================================================
export const failPayment = async (req, res) => {
  try {
    const { tranId } = req.params;

    await Transaction.findOneAndUpdate(
      { transactionId: tranId },
      { status: "fail" }
    );

    return res.send(`<html><body><script>window.location.href="${CLIENT_URL}/payment-fail";</script></body></html>`);
  } catch (err) {
    console.error("❌ Fail payment webhook error:", err.message);
    return res.send(`<html><body><script>window.location.href="${CLIENT_URL}/payment-fail";</script></body></html>`);
  }
};

// ============================================================
// POST /api/payment/cancel/:tranId
// Called by SSLCommerz webhook if user cancels payment
// ============================================================
export const cancelPayment = async (req, res) => {
  try {
    const { tranId } = req.params;

    await Transaction.findOneAndUpdate(
      { transactionId: tranId },
      { status: "cancel" }
    );

    return res.send(`<html><body><script>window.location.href="${CLIENT_URL}/payment-cancel";</script></body></html>`);
  } catch (err) {
    console.error("❌ Cancel payment webhook error:", err.message);
    return res.send(`<html><body><script>window.location.href="${CLIENT_URL}/payment-cancel";</script></body></html>`);
  }
};

// ============================================================
// GET /api/payment/my-transactions
// Logged-in user তার নিজের সব payment history দেখবে
// ============================================================
export const myTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("propertyId", "shortAddress area district price");

    return res.status(200).json({ transactions });
  } catch (err) {
    console.error("❌ My transactions error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
