import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getToken } from "../utils/auth";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          clearAuth();
          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.log(err);
        clearAuth();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Profile</h1>
      <p><strong>Name:</strong> {user?.name || "User"}</p>
      <p><strong>Phone:</strong> {user?.phone || "N/A"}</p>
      <p><strong>Country Code:</strong> {user?.countryCode || "+880"}</p>
      <p><strong>Referral:</strong> {user?.referral || "N/A"}</p>

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