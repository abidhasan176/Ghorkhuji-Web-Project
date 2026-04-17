import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./accessibleHome.css"; // Reuse existing UI

export default function SavedProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryIcons = {
    Family: "👨‍👩‍👧‍👦",
    Bachelor: "🧑",
    Office: "🏢",
    Sublet: "🔑",
    Hostel: "🏨",
    Shop: "🛍️",
  };

  const categoryImages = {
    Family: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
    Bachelor: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop",
    Office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
    Sublet: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
    Hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
    Shop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  };

  const fetchSavedProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("http://localhost:5000/api/auth/saved-properties");
      const data = await res.json();
      if (res.ok) {
        setProperties(data.savedProperties || []);
      } else if (res.status !== 401 && res.status !== 403) {
        setError(data.message || "Failed to load saved properties.");
      }
    } catch {
      setError("Server error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  // Remove property from saved list instantly locally
  const handleUnsave = async (propertyId) => {
    try {
      const res = await apiFetch(`http://localhost:5000/api/auth/saved-properties/${propertyId}`, {
        method: "POST",
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p._id !== propertyId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page" style={{ paddingTop: "20px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h2 className="section-title" style={{ textAlign: "left" }}>❤️ Saved Properties</h2>
            <p className="section-subtitle" style={{ textAlign: "left" }}>Properties you've saved for later.</p>
          </div>
          <button className="pd-back-btn" onClick={() => navigate("/accessible-home")} style={{ background: "#6366f1", border: "none" }}>
            ← Back to Home
          </button>
        </div>

        {loading && (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Loading saved properties...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box state-error">
            <span className="state-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="state-box state-empty">
            <span className="state-icon">🗑️</span>
            <p>You haven't saved any properties yet.</p>
            <button className="btn btn-dark" onClick={() => navigate("/search")}>
              🔍 Search Properties
            </button>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid-3">
            {properties.map((item) => (
              <div className="property-card" key={item._id} style={{ position: "relative" }}>
                <button 
                  onClick={() => handleUnsave(item._id)}
                  style={{
                    position: "absolute", top: "12px", right: "12px", zIndex: 10,
                    background: "#fff", border: "none", borderRadius: "50%",
                    width: "36px", height: "36px",
                    cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}
                  title="Remove from saved"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                <div className="property-img-wrap">
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : categoryImages[item.category] || categoryImages["Family"]
                    }
                    alt={item.shortAddress}
                    className="property-img"
                  />
                  <span className="cat-badge">{categoryIcons[item.category]} {item.category}</span>
                </div>
                <div className="property-body">
                  <h3>{item.propertyType} — {item.area}, {item.district}</h3>
                  <p className="prop-address">📍 {item.shortAddress}</p>
                  <div className="prop-meta">
                    <span>🛏 {item.bedroom} bed</span>
                    <span>🚿 {item.bathroom} bath</span>
                    {item.floor && <span>🏢 {item.floor} floor</span>}
                  </div>
                  <div className="prop-footer">
                    <strong className="prop-price">৳ {Number(item.price).toLocaleString()} / month</strong>
                    <span className="prop-month">{item.month}</span>
                  </div>
                  <button
                    className="btn btn-dark property-btn"
                    style={{ width: "100%" }}
                    onClick={() => navigate(`/property/${item._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
