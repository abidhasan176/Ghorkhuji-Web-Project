import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter using Gmail provider
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. hello.ghorkhuji@gmail.com
    pass: process.env.EMAIL_PASS  // App password
  }
});

/**
 * Send an HTML receipt to the user.
 * @param {string} toEmail - Customer email address
 * @param {object} receiptData - Transaction details
 */
export const sendPaymentReceipt = async (toEmail, receiptData) => {
  // If email configuration is missing, just skip silently (don't break payment flow)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️ Email configs missing. Skipping auto-email receipt.");
    return;
  }

  const {
    userName,
    transactionId,
    amount,
    propertyAddress,
    date
  } = receiptData;

  const mailOptions = {
    from: `"GhorKhuji Payments" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Booking Confirmed: ৳${amount} - GhorKhuji`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; margin: 0;">GhorKhuji</h1>
          <p style="color: #64748b; margin-top: 5px;">Easy Home Rentals</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <h2 style="color: #1e293b; margin-top: 0;">Payment Receipt</h2>
          <p style="font-size: 16px; color: #334155;">Hello <strong>${userName}</strong>,</p>
          <p style="color: #334155;">We have successfully received your advance booking payment. The property owner has been notified.</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; color: #64748b; width: 40%;">Transaction ID</td>
            <td style="padding: 12px 0; color: #1e293b; font-family: monospace; font-weight: bold;">${transactionId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; color: #64748b;">Amount Paid</td>
            <td style="padding: 12px 0; color: #1e293b; font-weight: bold;">৳ ${amount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; color: #64748b;">Property</td>
            <td style="padding: 12px 0; color: #1e293b;">${propertyAddress}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #64748b;">Date</td>
            <td style="padding: 12px 0; color: #1e293b;">${date}</td>
          </tr>
        </table>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 14px;">
          <p>Thank you for using GhorKhuji!</p>
          <p>Dhaka, Bangladesh</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Receipt sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Failed to send receipt email:", error);
  }
};
