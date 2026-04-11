import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page-bg">
      <div className="payment-card cancel-card">
        {/* Cancel icon */}
        <div className="payment-icon-wrapper cancel-icon-wrapper">
          <div className="payment-icon-circle cancel-circle">
            <span className="cancel-icon-text">!</span>
          </div>
        </div>

        <h1 className="payment-title cancel-title">Payment Cancelled</h1>
        <p className="payment-subtitle">
          ⚠️ You cancelled the payment. No amount was deducted from your account.
        </p>
        <p className="payment-desc">
          You can always come back and complete the advance booking whenever you are ready.
        </p>

        <div className="payment-actions">
          <button
            className="payment-btn warning-btn"
            onClick={() => navigate(-1)}
          >
            ← Go Back
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

export default PaymentCancel;
