import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    await clearAuth();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-overlay"></div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>

          <div className="profile-header-text">
            <h1>My Profile</h1>
            <p>Your account information</p>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-box">
            <span className="info-label">Name</span>
            <span className="info-value">{user?.name || "User"}</span>
          </div>

          <div className="info-box">
            <span className="info-label">Phone</span>
            <span className="info-value">{user?.phone || "Not added"}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="profile-btn secondary-btn"
            onClick={() => navigate("/accessible-home")}
          >
            Back to Home
          </button>

          <button className="profile-btn primary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}