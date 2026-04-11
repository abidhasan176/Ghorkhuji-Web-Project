import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./accessibleHome.css";
import { clearAuth, getToken, getUser } from "../utils/auth";

const categories = ["All", "Family", "Bachelor", "Office", "Sublet", "Hostel", "Shop"];

const categoryIcons = {
  All: "🏘️",
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

const INITIAL_VISIBLE = 6; // 2 rows × 3 cols

export default function AccessibleHome() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Get current user to check role
  const currentUser = getUser();

  // Properties state
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");
  const [showAllProperties, setShowAllProperties] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Saved properties state
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setPropertiesLoading(true);
      setOrdersLoading(true);
      setPropertiesError("");
      setOrdersError("");

      const token = getToken();
      const promises = [
        fetch("http://localhost:5000/api/properties", { credentials: "include" }),
        fetch("http://localhost:5000/api/orders", { credentials: "include" }),
      ];

      if (token) {
        promises.push(fetch("http://localhost:5000/api/auth/saved-properties", { credentials: "include" }));
      }

      const results = await Promise.allSettled(promises);
      const propRes = results[0];
      const orderRes = results[1];
      const savedRes = token ? results[2] : null;

      // Handle properties
      if (propRes.status === "fulfilled") {
        try {
          const data = await propRes.value.json();
          if (propRes.value.ok) setProperties(data.properties || []);
          else setPropertiesError("Failed to load properties.");
        } catch {
          setPropertiesError("Server error. Make sure the server is running.");
        }
      } else {
        setPropertiesError("Server error. Make sure the server is running.");
      }
      setPropertiesLoading(false);

      // Handle orders
      if (orderRes.status === "fulfilled") {
        try {
          const data = await orderRes.value.json();
          if (orderRes.value.ok) setOrders(data.orders || []);
          else setOrdersError("Failed to load requests.");
        } catch {
          setOrdersError("Server error. Make sure the server is running.");
        }
      } else {
        setOrdersError("Server error. Make sure the server is running.");
      }
      setOrdersLoading(false);

      // Handle saved items
      if (savedRes && savedRes.status === "fulfilled" && savedRes.value.ok) {
        try {
          const data = await savedRes.value.json();
          const ids = data.savedProperties?.map(p => p._id) || [];
          setSavedPropertyIds(new Set(ids));
        } catch (e) {
          console.log("Error fetching saved items", e);
        }
      }
    };

    fetchData();

    // Polling for unread messages
    let interval;
    if (getToken()) {
      const fetchUnread = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/messages/unread", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setUnreadCount(data.unreadCount || 0);
          }
        } catch (e) {}
      };
      fetchUnread();
      interval = setInterval(fetchUnread, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleToggleSave = async (propertyId) => {
    if (!getToken()) return navigate("/login");
    try {
      const res = await fetch(`http://localhost:5000/api/auth/saved-properties/${propertyId}`, {
         method: "POST",
         credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setSavedPropertyIds(prev => {
          const newSet = new Set(prev);
          if (data.isSaved) newSet.add(propertyId);
          else newSet.delete(propertyId);
          return newSet;
        });
      }
    } catch (err) {
       console.log(err);
    }
  };

  const handleLogout = async () => {
    await clearAuth();
    navigate("/");
  };

  // Filtered lists by category
  const filteredProperties =
    activeCategory === "All"
      ? properties
      : properties.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  const filteredOrders =
    activeCategory === "All"
      ? orders
      : orders.filter((o) => o.category?.toLowerCase() === activeCategory.toLowerCase());

  // Sliced lists for display
  const visibleProperties = showAllProperties
    ? filteredProperties
    : filteredProperties.slice(0, INITIAL_VISIBLE);

  const visibleOrders = showAllOrders
    ? filteredOrders
    : filteredOrders.slice(0, INITIAL_VISIBLE);

  // Reset show-more when category changes
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setShowAllProperties(false);
    setShowAllOrders(false);
  };

  return (
    <div className="page">
      {/* ── Header ── */}
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
            <a href="#properties">Property list</a>
            <a href="#orders">Looking For</a>
            <a href="#footer">Contact</a>
          </nav>

          <div className="nav-actions">
            {!getToken() ? (
              <>
                <button type="button" className="top-action-btn" onClick={() => navigate("/login")}>
                  <span>Login</span>
                </button>
                <button type="button" className="top-action-btn" style={{ background: "#818cf8", borderColor: "#818cf8" }} onClick={() => navigate("/register")}>
                  <span>Register</span>
                </button>
              </>
            ) : (
              <>
                <button className="top-action-btn" onClick={() => navigate("/search")}>
                  <span className="top-action-icon">🔍</span>
                  <span>Search</span>
                </button>
                <button className="top-action-btn" onClick={() => navigate("/add-property")}>
                  <span className="top-action-icon">＋</span>
                  <span>Add Property</span>
                </button>
                <button className="top-action-btn" onClick={() => navigate("/order-home")}>
                  <span className="top-action-icon">⌂</span>
                  <span>Order Home</span>
                </button>
                <button className="iconBtn" onClick={() => navigate("/saved-properties")} title="Saved Properties" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button className="iconBtn" style={{ position: 'relative' }} onClick={() => navigate("/chat")} title="Messages">
                  💬
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '-5px', right: '-5px',
                      background: 'red', color: 'white', fontSize: '10px',
                      fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button className="iconBtn" onClick={() => navigate("/profile")} title="Profile">
                  👤
                </button>
                {currentUser?.role === "admin" && (
                  <button className="btn btn-dark" style={{ background: "#4f46e5", borderColor: "#4f46e5" }} onClick={() => navigate("/admin")} title="Admin Dashboard">
                    📊 Admin Panel
                  </button>
                )}
                <button className="btn btn-dark" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="hero-banner" id="home">
        <div className="banner-overlay">
          <div className="category-bar inside-banner">
            <div className="container category-wrapper">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`category-item ${activeCategory === item ? "category-item--active" : ""}`}
                  onClick={() => {
                    handleCategoryChange(item);
                    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
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
              onClick={() => document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })}
            >
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 1 — Available Properties
      ══════════════════════════════════════════ */}
      <section className="section" id="properties">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {activeCategory === "All" ? "🏠 Available Properties" : `🏠 ${activeCategory} Properties`}
              </h2>
              <p className="section-subtitle">
                {activeCategory === "All"
                  ? "Browse all available listings added by owners."
                  : `Showing ${activeCategory.toLowerCase()} listings.`}
              </p>
            </div>
            {activeCategory !== "All" && (
              <button className="clear-filter-btn" onClick={() => handleCategoryChange("All")}>
                ✕ Clear Filter
              </button>
            )}
          </div>

          {propertiesLoading && (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          )}

          {!propertiesLoading && propertiesError && (
            <div className="state-box state-error">
              <span className="state-icon">⚠️</span>
              <p>{propertiesError}</p>
            </div>
          )}

          {!propertiesLoading && !propertiesError && filteredProperties.length === 0 && (
            <div className="state-box state-empty">
              <span className="state-icon">🏚️</span>
              <p>No properties found{activeCategory !== "All" ? ` in ${activeCategory} category` : ""}.</p>
              <button className="btn btn-dark" onClick={() => navigate("/add-property")}>
                + Add First Property
              </button>
            </div>
          )}

          {!propertiesLoading && !propertiesError && visibleProperties.length > 0 && (
            <>
              <div className="grid-3">
                {visibleProperties.map((item) => {
                  const isSaved = savedPropertyIds.has(item._id);
                  return (
                  <div className="property-card" key={item._id} style={{ position: "relative" }}>
                    
                    <button 
                      onClick={() => handleToggleSave(item._id)}
                      style={{
                        position: "absolute", top: "12px", right: "12px", zIndex: 10,
                        background: "#fff", border: "none", borderRadius: "50%",
                        width: "36px", height: "36px",
                        cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s ease"
                      }}
                      title={isSaved ? "Remove from saved" : "Save this property"}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "white" : "transparent"} stroke={isSaved ? "black" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        onClick={() => getToken() ? navigate(`/property/${item._id}`) : navigate("/login")}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>

              {filteredProperties.length > INITIAL_VISIBLE && (
                <div className="show-more-wrap">
                  <button
                    className="btn-show-more"
                    onClick={() => setShowAllProperties((v) => !v)}
                  >
                    {showAllProperties
                      ? "▲ Show Less"
                      : `▼ Show More Properties (${filteredProperties.length - INITIAL_VISIBLE} more)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider">
        <span className="divider-label">Looking For a Home</span>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — Looking For (Orders)
      ══════════════════════════════════════════ */}
      <section className="section section-orders" id="orders">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {activeCategory === "All" ? "🔍 Looking For a Home" : `🔍 Looking For — ${activeCategory}`}
              </h2>
              <p className="section-subtitle">
                Tenants actively searching for a place to rent.
              </p>
            </div>
            {activeCategory !== "All" && (
              <button className="clear-filter-btn" onClick={() => handleCategoryChange("All")}>
                ✕ Clear Filter
              </button>
            )}
          </div>

          {ordersLoading && (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Loading requests...</p>
            </div>
          )}

          {!ordersLoading && ordersError && (
            <div className="state-box state-error">
              <span className="state-icon">⚠️</span>
              <p>{ordersError}</p>
            </div>
          )}

          {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
            <div className="state-box state-empty">
              <span className="state-icon">🔎</span>
              <p>No requests found{activeCategory !== "All" ? ` in ${activeCategory} category` : ""}.</p>
              <button className="btn btn-order" onClick={() => navigate("/order-home")}>
                + Post a Request
              </button>
            </div>
          )}

          {!ordersLoading && !ordersError && visibleOrders.length > 0 && (
            <>
              <div className="grid-3">
                {visibleOrders.map((item) => {
                  const loc = item.locations?.[0];
                  const postedDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })
                    : "";
                  return (
                    <div className="order-card" key={item._id}>
                      <div className="order-card-header">
                        <span className="order-badge">
                          {categoryIcons[item.category]} {item.category}
                        </span>
                        <span className="order-type-label">Looking For</span>
                      </div>
                      <div className="order-card-body">
                        {loc && (
                          <h3 className="order-location">
                            📍 {loc.area}, {loc.district}
                            {item.locations.length > 1 && (
                              <span className="order-more-locs"> +{item.locations.length - 1} more</span>
                            )}
                          </h3>
                        )}
                        <div className="prop-meta order-meta">
                          <span>🛏 {item.room} bed</span>
                          <span>🚿 {item.bathroom} bath</span>
                          <span>👤 {item.gender}</span>
                        </div>
                        <div className="order-footer">
                          <strong className="order-budget">৳ {Number(item.maxBudget).toLocaleString()} max</strong>
                          {postedDate && (
                            <span className="prop-month">🗓 {postedDate}</span>
                          )}
                        </div>
                        <button
                          className="btn btn-order order-contact-btn"
                          onClick={() => getToken() ? navigate(`/order/${item._id}`) : navigate("/login")}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredOrders.length > INITIAL_VISIBLE && (
                <div className="show-more-wrap">
                  <button
                    className="btn-show-more btn-show-more--order"
                    onClick={() => setShowAllOrders((v) => !v)}
                  >
                    {showAllOrders
                      ? "▲ Show Less"
                      : `▼ Show More Requests (${filteredOrders.length - INITIAL_VISIBLE} more)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer" id="footer">
        <div className="container footer-grid">
          <div>
            <h3>GhorKhuji</h3>
            <p className="footer-muted">Simple house rent solution for everyone.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#properties">Properties</a>
            <a href="#orders">Looking For</a>
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