import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./accessibleHome.css";
import { clearAuth, getToken } from "../utils/auth";

const categories = ["All", "Family", "Bachelor", "Office", "Sublet", "Hostel", "Shop"];

// Category icon map
const categoryIcons = {
  All: "🏘️",
  Family: "👨‍👩‍👧‍👦",
  Bachelor: "🧑",
  Office: "🏢",
  Sublet: "🔑",
  Hostel: "🏨",
  Shop: "🛍️",
};

// Fallback images per category
const categoryImages = {
  Family: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
  Bachelor: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop",
  Office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
  Sublet: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
  Hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
  Shop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
};

export default function AccessibleHome() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/properties", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setProperties(data.properties || []);
        } else {
          setError("Failed to load properties.");
        }
      } catch (err) {
        setError("Server error. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleLogout = async () => {
    await clearAuth();
    navigate("/");
  };

  // Filter properties by selected category
  const filteredProperties =
    activeCategory === "All"
      ? properties
      : properties.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <div className="page">
      <header className="header">
        <div className="container nav">
          <div className="brand">
            <div className="logo">🏠</div>
            <div className="brand-text">
              <h1>GhorKhuji</h1>
              <p>Find home easily</p>
            </div>
          </div>

          <nav className="menu">
            <a href="#home">Home</a>
            <a href="#featured">Property list</a>
            <a href="#featured">Saved Property</a>
            <a href="#footer">Contact</a>
          </nav>

          <div className="nav-actions">
            <button
              className="top-action-btn"
              onClick={() => navigate("/add-property")}
            >
              <span className="top-action-icon">＋</span>
              <span>Add Property</span>
            </button>

            <button
              className="top-action-btn"
              onClick={() => navigate("/order-home")}
            >
              <span className="top-action-icon">⌂</span>
              <span>Order Home</span>
            </button>

            <button
              className="iconBtn"
              onClick={() => navigate("/profile")}
              title="Profile"
            >
              👤
            </button>

            <button className="btn btn-dark" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="hero-banner" id="home">
        <div className="banner-overlay">
          <div className="category-bar inside-banner">
            <div className="container category-wrapper">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`category-item ${activeCategory === item ? "category-item--active" : ""}`}
                  onClick={() => {
                    setActiveCategory(item);
                    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className="cat-icon">{categoryIcons[item]}</span>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="banner-content">
            <h2>বাসা খুঁজুন সহজেই</h2>
            <p>Find your perfect home quickly and easily.</p>
            <button
              className="btn btn-dark"
              onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
            >
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {activeCategory === "All" ? "All Properties" : `${activeCategory} Properties`}
              </h2>
              <p className="section-subtitle">
                {activeCategory === "All"
                  ? "Browse all available listings."
                  : `Showing ${activeCategory.toLowerCase()} category listings.`}
              </p>
            </div>
            {activeCategory !== "All" && (
              <button
                className="clear-filter-btn"
                onClick={() => setActiveCategory("All")}
              >
                ✕ Clear Filter
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="state-box state-error">
              <span className="state-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProperties.length === 0 && (
            <div className="state-box state-empty">
              <span className="state-icon">🏚️</span>
              <p>No properties found{activeCategory !== "All" ? ` in <strong>${activeCategory}</strong> category` : ""}.</p>
              <button className="btn btn-dark" onClick={() => navigate("/add-property")}>
                + Add First Property
              </button>
            </div>
          )}

          {/* Property Cards */}
          {!loading && !error && filteredProperties.length > 0 && (
            <div className="grid-3">
              {filteredProperties.map((item) => (
                <div className="property-card" key={item._id}>
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
      </section>

      <footer className="footer" id="footer">
        <div className="container footer-grid">
          <div>
            <h3>GhorKhuji</h3>
            <p className="footer-muted">Simple house rent solution for everyone.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#featured">Featured</a>
          </div>
          <div>
            <h3>Contact</h3>
            <p className="footer-muted">Dhaka, Bangladesh</p>
          </div>
        </div>

        <p className="copyright">© 2026 GhorKhuji. All rights reserved.</p>
      </footer>
    </div>
  );
}