import express from "express";
import {
  initiatePayment,
  successPayment,
  failPayment,
  cancelPayment,
  myTransactions,
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payment/initiate/:propertyId
// Protected — user must be logged in to book advance
router.post("/initiate/:propertyId", authMiddleware, initiatePayment);

// POST /api/payment/success/:tranId
// Public — SSLCommerz will call this webhook after successful payment
router.post("/success/:tranId", successPayment);

// POST /api/payment/fail/:tranId
// Public — SSLCommerz will call this webhook on payment failure
router.post("/fail/:tranId", failPayment);

// POST /api/payment/cancel/:tranId
// Public — SSLCommerz will call this webhook if user cancels
router.post("/cancel/:tranId", cancelPayment);

// GET /api/payment/my-transactions
// Protected — logged-in user তার সব payment history দেখবে
router.get("/my-transactions", authMiddleware, myTransactions);

export default router;
