import { useState } from "react";
import { apiFetch } from "../utils/api";
import "./BookNowButton.css";

// BookNowButton — PropertyDetails পেজে এই component ব্যবহার করুন
// props:
//   propertyId  — property-র MongoDB _id
//   propertyAddress — দেখানোর জন্য address (optional)
const BookNowButton = ({ propertyId, propertyAddress = "this property" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBookNow = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(
        `http://localhost:5000/api/payment/initiate/${propertyId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Payment initiation failed. Please try again.");
        setLoading(false);
        return;
      }

      // SSLCommerz payment page এ redirect করো
      window.location.href = data.paymentUrl;

    } catch (err) {
      console.error("Book Now error:", err);
      setError("Something went wrong. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="book-now-wrapper">
      <button
        className={`book-now-btn ${loading ? "loading" : ""}`}
        onClick={handleBookNow}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="btn-spinner"></span>
            Redirecting to Payment...
          </>
        ) : (
          <>
            <span className="btn-icon">💳</span>
            Book Now — ৳500 Advance
          </>
        )}
      </button>

      {error && (
        <p className="book-now-error">⚠️ {error}</p>
      )}

      <p className="book-now-note">
        Secure payment via SSLCommerz. You will be redirected to the payment gateway.
      </p>
    </div>
  );
};

export default BookNowButton;
