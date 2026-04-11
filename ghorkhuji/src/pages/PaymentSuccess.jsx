import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page-bg">
      <div className="payment-card success-card">
        {/* Animated checkmark */}
        <div className="payment-icon-wrapper success-icon-wrapper">
          <div className="payment-icon-circle success-circle">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </div>

        <h1 className="payment-title success-title">Payment Successful!</h1>
        <p className="payment-subtitle">
          🎉 Your advance booking of <strong>৳500</strong> has been confirmed.
        </p>
        <p className="payment-desc">
          The property owner will contact you shortly. Check your email for the booking confirmation.
        </p>

        <div className="payment-actions">
          <button
            className="payment-btn primary-btn"
            onClick={() => navigate("/accessible-home")}
          >
            Go to Home
          </button>
          <button
            className="payment-btn secondary-btn"
            onClick={() => navigate("/accessible-home")}
          >
            Browse More Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
