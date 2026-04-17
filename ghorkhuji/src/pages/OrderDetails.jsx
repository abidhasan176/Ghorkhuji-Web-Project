import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./PropertyDetails.css"; // Reuse same base styles

const categoryIcons = {
  Family: "👨‍👩‍👧‍👦",
  Bachelor: "🧑",
  Office: "🏢",
  Sublet: "🔑",
  Hostel: "🏨",
  Shop: "🛍️",
};

const categoryImages = {
  Family: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  Bachelor: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  Office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  Sublet: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
  Hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop",
  Shop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(`http://localhost:5000/api/orders/${id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
        } else if (res.status !== 401 && res.status !== 403) {
          setError(data.message || "Request not found.");
        }
      } catch {
        setError("Server error. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Loading request details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-loading">
        <span style={{ fontSize: 52 }}>⚠️</span>
        <p style={{ color: "#dc2626" }}>{error}</p>
        <button className="pd-back-btn" onClick={() => navigate("/accessible-home")}>
          ← Back to listings
        </button>
      </div>
    );
  }

  const coverImage = categoryImages[order.category] || categoryImages["Family"];
  const postedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "";

  const optionalDetails = [
    { label: "Kitchen", icon: "🍳", value: order.kitchen },
    { label: "Gas", icon: "🔥", value: order.gas },
    { label: "Living Space", icon: "🛋️", value: order.livingSpace },
    { label: "Room Sharing", icon: "🤝", value: order.roomSharing },
    { label: "Floor Preference", icon: "🏢", value: order.floorPreference },
    { label: "Lift", icon: "🛗", value: order.lift },
    { label: "Parking", icon: "🚗", value: order.parking },
  ].filter((d) => d.value && d.value !== "");

  return (
    <div className="pd-page">
      {/* Header */}
      <header className="pd-header">
        <div className="pd-header-inner">
          <button className="pd-back-btn" onClick={() => navigate("/accessible-home")}>
            ← Back to listings
          </button>
          <div className="pd-brand">
            <span className="pd-logo">🏠</span>
            <span className="pd-brand-name">GhorKhuji</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="pd-hero od-hero">
        <img src={coverImage} alt={order.category} className="pd-hero-img" />
        <div className="pd-hero-overlay od-hero-overlay">
          <span className="pd-cat-badge od-cat-badge">
            🔍 Looking For — {categoryIcons[order.category]} {order.category}
          </span>
          <div className="pd-hero-info">
            <h1 className="pd-title">
              {order.category} Rental Request
            </h1>
            {order.locations && order.locations.length > 0 && (
              <p className="pd-address">
                📍 {order.locations.map((l) => `${l.area}, ${l.district}`).join(" | ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pd-body">
        <div className="pd-main">

          {/* Budget card */}
          <div className="pd-price-card od-budget-card">
            <div className="pd-price-left">
              <span className="pd-price-amount od-budget-amount">
                ৳ {Number(order.maxBudget).toLocaleString()}
              </span>
              <span className="pd-price-type">max budget / month</span>
            </div>
            <div className="pd-price-right">
              <span className="pd-month-badge od-need-badge">
                📅 Need from: {order.needFrom}
              </span>
            </div>
          </div>

          {/* Primary Requirements */}
          <div className="pd-section">
            <h2 className="pd-section-title">🏠 Primary Requirements</h2>
            <div className="pd-info-grid">
              <div className="pd-info-item">
                <span className="pd-info-label">Category</span>
                <span className="pd-info-value">{categoryIcons[order.category]} {order.category}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Gender</span>
                <span className="pd-info-value">👤 {order.gender}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Bedrooms Needed</span>
                <span className="pd-info-value">🛏 {order.room}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Bathrooms Needed</span>
                <span className="pd-info-value">🚿 {order.bathroom}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Need From</span>
                <span className="pd-info-value">📅 {order.needFrom}</span>
              </div>
              {postedDate && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Posted On</span>
                  <span className="pd-info-value">🗓 {postedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Preferred Locations */}
          {order.locations && order.locations.length > 0 && (
            <div className="pd-section">
              <h2 className="pd-section-title">📍 Preferred Locations</h2>
              <div className="od-locations-list">
                {order.locations.map((loc, i) => (
                  <div key={i} className="od-location-chip">
                    <span className="od-loc-num">{i + 1}</span>
                    <span>{loc.area}, {loc.district}, {loc.division}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Preferences */}
          {optionalDetails.length > 0 && (
            <div className="pd-section">
              <h2 className="pd-section-title">⚙️ Additional Preferences</h2>
              <div className="pd-info-grid">
                {optionalDetails.map((d) => (
                  <div className="pd-info-item" key={d.label}>
                    <span className="pd-info-label">{d.label}</span>
                    <span className="pd-info-value">{d.icon} {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {order.postedBy && (
            <div className="pd-section pd-contact-section">
              <h2 className="pd-section-title">📞 Contact Tenant</h2>
              <div className="pd-contact-card od-contact-card">
                <div className="pd-contact-avatar od-contact-avatar">👤</div>
                <div>
                  <p className="pd-contact-name">{order.postedBy.name || "Tenant"}</p>
                  {order.postedBy.phone && (
                    <a href={`tel:${order.postedBy.phone}`} className="pd-contact-phone od-contact-phone">
                      📱 {order.postedBy.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
