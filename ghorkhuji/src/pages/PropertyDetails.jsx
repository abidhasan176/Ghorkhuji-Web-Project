import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookNowButton from "../components/BookNowButton";
import "./PropertyDetails.css";

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

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());

  useEffect(() => {
    const fetchPropertyAndSaved = async () => {
      setLoading(true);
      setError("");
      try {
        const [propRes, savedRes] = await Promise.all([
          fetch(`http://localhost:5000/api/properties/${id}`, { credentials: "include" }),
          fetch("http://localhost:5000/api/auth/saved-properties", { credentials: "include" }),
        ]);

        if (propRes.ok) {
          const data = await propRes.json();
          setProperty(data.property);
        } else {
          const data = await propRes.json();
          setError(data.message || "Property not found.");
        }

        if (savedRes.ok) {
           const data = await savedRes.json();
           const ids = data.savedProperties?.map(p => p._id) || [];
           setSavedPropertyIds(new Set(ids));
        }

      } catch (err) {
        setError("Server error. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyAndSaved();
  }, [id]);

  const handleToggleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/saved-properties/${id}`, {
         method: "POST",
         credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setSavedPropertyIds(prev => {
          const newSet = new Set(prev);
          if (data.isSaved) newSet.add(id);
          else newSet.delete(id);
          return newSet;
        });
      }
    } catch (err) {
       console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Loading property details...</p>
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

  const coverImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : categoryImages[property.category] || categoryImages["Family"];

  const bills = [
    { key: "includesElectricity", label: "Electricity Bill", icon: "⚡" },
    { key: "includesGas", label: "Gas Bill", icon: "🔥" },
    { key: "includesWater", label: "Water Bill", icon: "💧" },
    { key: "includesLift", label: "Lift Bill", icon: "🛗" },
    { key: "includesSecurity", label: "Security Bill", icon: "🛡️" },
    { key: "includesServant", label: "Servant Charge", icon: "🧹" },
    { key: "includesNet", label: "Internet Bill", icon: "🌐" },
  ];

  const includedBills = bills.filter((b) => property[b.key]);
  const isSaved = savedPropertyIds.has(id);

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

      {/* Hero image */}
      <div className="pd-hero">
        <img src={coverImage} alt={property.shortAddress} className="pd-hero-img" />
        <div className="pd-hero-overlay">
          <span className="pd-cat-badge">
            {categoryIcons[property.category]} {property.category}
          </span>
          <div className="pd-hero-info">
            <h1 className="pd-title">
              {property.propertyType} — {property.area}, {property.district}
            </h1>
            <p className="pd-address">📍 {property.shortAddress}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pd-body">
        <div className="pd-main">

          {/* Price card */}
          <div className="pd-price-card">
            <div className="pd-price-left">
              <span className="pd-price-amount">৳ {Number(property.price).toLocaleString()}</span>
              <span className="pd-price-type">/ {property.priceType}</span>
            </div>
            <div className="pd-price-right" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className="pd-month-badge">Available: {property.month}</span>
              <button 
                onClick={handleToggleSave}
                style={{
                  background: isSaved ? "#fff" : "rgba(255,255,255,0.2)", 
                  border: isSaved ? "none" : "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "50%",
                  width: "44px", height: "44px",
                  cursor: "pointer", 
                  boxShadow: isSaved ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease"
                }}
                title={isSaved ? "Remove from saved" : "Save this property"}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? "white" : "transparent"} stroke={isSaved ? "black" : "#cbd5e1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Basic info grid */}
          <div className="pd-section">
            <h2 className="pd-section-title">🏠 Basic Information</h2>
            <div className="pd-info-grid">
              <div className="pd-info-item">
                <span className="pd-info-label">Category</span>
                <span className="pd-info-value">{categoryIcons[property.category]} {property.category}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Property Type</span>
                <span className="pd-info-value">{property.propertyType}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Bedroom</span>
                <span className="pd-info-value">🛏 {property.bedroom}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Bathroom</span>
                <span className="pd-info-value">🚿 {property.bathroom}</span>
              </div>
              {property.balcony && property.balcony !== "None" && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Balcony</span>
                  <span className="pd-info-value">🪟 {property.balcony}</span>
                </div>
              )}
              {property.floor && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Floor</span>
                  <span className="pd-info-value">🏢 {property.floor}</span>
                </div>
              )}
              <div className="pd-info-item">
                <span className="pd-info-label">Gender</span>
                <span className="pd-info-value">👤 {property.gender}</span>
              </div>
              {property.size && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Size</span>
                  <span className="pd-info-value">📐 {property.size} sqft</span>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="pd-section">
            <h2 className="pd-section-title">📍 Location Details</h2>
            <div className="pd-info-grid">
              <div className="pd-info-item">
                <span className="pd-info-label">Division</span>
                <span className="pd-info-value">{property.division}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">District</span>
                <span className="pd-info-value">{property.district}</span>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-label">Area</span>
                <span className="pd-info-value">{property.area}</span>
              </div>
              {property.block && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Block</span>
                  <span className="pd-info-value">{property.block}</span>
                </div>
              )}
              {property.sectorNo && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Sector No</span>
                  <span className="pd-info-value">{property.sectorNo}</span>
                </div>
              )}
              {property.roadNo && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Road No</span>
                  <span className="pd-info-value">{property.roadNo}</span>
                </div>
              )}
              {property.houseNo && (
                <div className="pd-info-item">
                  <span className="pd-info-label">House No</span>
                  <span className="pd-info-value">{property.houseNo}</span>
                </div>
              )}
              {property.postalCode && (
                <div className="pd-info-item">
                  <span className="pd-info-label">Postal Code</span>
                  <span className="pd-info-value">{property.postalCode}</span>
                </div>
              )}
            </div>
            <div className="pd-full-address">
              <span className="pd-info-label">Full Address</span>
              <p>{property.shortAddress}</p>
            </div>
          </div>

          {/* Description */}
          {property.details && (
            <div className="pd-section">
              <h2 className="pd-section-title">📝 Property Details</h2>
              <p className="pd-description">{property.details}</p>
            </div>
          )}

          {/* Bills Included */}
          <div className="pd-section">
            <h2 className="pd-section-title">💰 Price Includes</h2>
            {includedBills.length === 0 ? (
              <p className="pd-no-bills">No bills included in the rent.</p>
            ) : (
              <div className="pd-bills-list">
                {includedBills.map((b) => (
                  <div className="pd-bill-chip" key={b.key}>
                    <span>{b.icon}</span>
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Posted by */}
          {property.postedBy && (
            <div className="pd-section pd-contact-section">
              <h2 className="pd-section-title">📞 Contact / Posted By</h2>
              <div className="pd-contact-card">
                <div className="pd-contact-avatar">👤</div>
                <div>
                  <p className="pd-contact-name">{property.postedBy.name || "Owner"}</p>
                  {property.postedBy.phone && (
                    <a href={`tel:${property.postedBy.phone}`} className="pd-contact-phone">
                      📱 {property.postedBy.phone}
                    </a>
                  )}
                  <button 
                    className="pd-chat-btn" 
                    onClick={() => navigate(`/chat/${property.postedBy._id || property.postedBy}?propertyId=${property._id}`)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'background 0.2s ease',
                      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    💬 Chat with Owner
                  </button>
                  {/* Payment integration: BookNowButton */}
                  <div style={{ marginTop: '16px' }}>
                    <BookNowButton propertyId={property._id} propertyAddress={property.shortAddress} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
