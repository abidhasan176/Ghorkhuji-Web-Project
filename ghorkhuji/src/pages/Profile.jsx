import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth";
import { apiFetch } from "../utils/api";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiFetch("http://localhost:5000/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setEditName(data.user.name);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else if (res.status !== 401 && res.status !== 403) {
          // Non-auth error: fall back to cached data
          const localUser = JSON.parse(localStorage.getItem("user") || "null");
          if (localUser) { setUser(localUser); setEditName(localUser.name); }
        }
        // 401/403 is handled by apiFetch → auto-redirect to /login
      } catch (err) {
        console.log("Error fetching user info:", err);
      }
    };
    fetchMe();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return setError("Name is required");

    setUpdating(true);
    setError("");

    try {
      const res = await apiFetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsEditing(false);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

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
            <h1>{isEditing ? "Edit Profile" : "My Profile"}</h1>
            <p>{isEditing ? "Update your personal details" : "Your account information"}</p>
          </div>
        </div>

        {error && <div className="profile-error">{error}</div>}

        {!isEditing ? (
          <>
            <div className="profile-info">
              <div className="info-box">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.name || "User"}</span>
              </div>

              <div className="info-box">
                <span className="info-label">Phone</span>
                <span className="info-value">{user?.phone || "Not added"}</span>
              </div>

              {user?.referral && (
                <div className="info-box full-width">
                  <span className="info-label">Referral Code</span>
                  <span className="info-value">{user.referral}</span>
                </div>
              )}
            </div>

            <div className="profile-actions">
              <button
                className="profile-btn secondary-btn"
                onClick={() => navigate("/accessible-home")}
              >
                Back to Home
              </button>

              <button
                className="profile-btn secondary-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>

              <button className="profile-btn primary-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <form className="edit-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="profile-btn secondary-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditName(user?.name || "");
                  setError("");
                }}
                disabled={updating}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-btn primary-btn"
                disabled={updating}
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}