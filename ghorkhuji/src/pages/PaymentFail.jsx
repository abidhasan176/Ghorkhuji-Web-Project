import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page-bg">
      <div className="payment-card fail-card">
        {/* Failure icon */}
        <div className="payment-icon-wrapper fail-icon-wrapper">
          <div className="payment-icon-circle fail-circle">
            <svg
              className="crossmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle className="crossmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="crossmark-cross" fill="none" d="M16 16 36 36 M36 16 16 36" />
            </svg>
          </div>
        </div>

        <h1 className="payment-title fail-title">Payment Failed</h1>
        <p className="payment-subtitle">
          ❌ Your payment could not be processed. No amount was deducted.
        </p>
        <p className="payment-desc">
          This may have happened due to a network issue or an incorrect card detail. Please try again.
        </p>

        <div className="payment-actions">
          <button
            className="payment-btn danger-btn"
            onClick={() => navigate(-1)}
          >
            ← Try Again
          </button>
          <button
            className="payment-btn primary-btn"
            onClick={() => navigate("/accessible-home")}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
