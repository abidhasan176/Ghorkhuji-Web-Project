import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./accessibleHome.css";

const categories = ["All", "Family", "Bachelor", "Office", "Sublet", "Hostel", "Shop"];
const propertyTypes = ["All", "Flat", "House", "Room", "Seat", "Commercial Space", "Shop", "Office", "Garage"];

const categoryIcons = {
  All: "🏘️", Family: "👨‍👩‍👧‍👦", Bachelor: "🧑", Office: "🏢",
  Sublet: "🔑", Hostel: "🏨", Shop: "🛍️",
};

const categoryImages = {
  Family: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
  Bachelor: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop",
  Office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
  Sublet: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
  Hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
  Shop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
};

export default function SearchProperties() {
  const navigate = useNavigate();

  // Search form state
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [propertyType, setPropertyType] = useState("All");
  const [maxBudget, setMaxBudget] = useState("");

  // Results state
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // User saved properties tracking
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());

  useEffect(() => {
    // Fetch saved properties on load to sync heart icons
    const fetchSaved = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/saved-properties", {
           credentials: "include" 
        });
        if (res.ok) {
          const data = await res.json();
          const ids = data.savedProperties.map(p => p._id);
          setSavedPropertyIds(new Set(ids));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchSaved();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true);
    
    // Construct query parameters
    const params = new URLSearchParams();
    if (query.trim()) params.append("query", query.trim());
    if (category !== "All") params.append("category", category);
    if (propertyType !== "All") params.append("propertyType", propertyType);
    if (maxBudget) params.append("maxBudget", maxBudget);

    try {
      const res = await fetch(`http://localhost:5000/api/properties/search?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties || []);
      } else {
        setError(data.message || "Failed to fetch properties");
      }
    } catch {
      setError("Server error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (propertyId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/saved-properties/${propertyId}`, {
        method: "POST",
        credentials: "include",
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

  return (
    <div className="page" style={{ paddingTop: "20px" }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h2 className="section-title" style={{ textAlign: "left" }}>🔍 Search Properties</h2>
            <p className="section-subtitle" style={{ textAlign: "left" }}>Find your perfect home with advanced filters.</p>
          </div>
          <button className="pd-back-btn" onClick={() => navigate("/accessible-home")} style={{ background: "#6366f1", border: "none" }}>
            ← Back to Home
          </button>
        </div>

        {/* Search Form */}
        <div style={{ 
          background: "#fff", padding: "24px", borderRadius: "20px", 
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)", marginBottom: "40px" 
        }}>
          <form onSubmit={handleSearch} style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
            
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#475569" }}>
                Location / Address
              </label>
              <input 
                type="text" 
                placeholder="e.g. Mirpur, Dhaka"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none" }}
              />
            </div>

            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#475569" }}>
                Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", background: "#fff" }}
              >
                {categories.map(c => <option key={c} value={c}>{categoryIcons[c] || ""} {c}</option>)}
              </select>
            </div>

            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#475569" }}>
                Property Type
              </label>
              <select 
                value={propertyType} 
                onChange={(e) => setPropertyType(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", background: "#fff" }}
              >
                {propertyTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
              </select>
            </div>

            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#475569" }}>
                Max Budget (৳)
              </label>
              <input 
                type="number" 
                placeholder="e.g. 15000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none" }}
              />
            </div>

            <button type="submit" className="btn btn-dark" style={{ height: "46px", padding: "0 32px", fontSize: "16px" }}>
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Searching properties...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box state-error">
            <span className="state-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && hasSearched && properties.length === 0 && (
          <div className="state-box state-empty">
            <span className="state-icon">🔎</span>
            <p>No properties found matching your criteria.</p>
            <button className="btn btn-dark" onClick={() => { setQuery(""); setCategory("All"); setPropertyType("All"); setMaxBudget(""); }}>
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div>
            <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>Found {properties.length} Results:</h3>
            <div className="grid-3">
              {properties.map((item) => {
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
                        style={{ width: "100%" }}
                        onClick={() => navigate(`/property/${item._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
