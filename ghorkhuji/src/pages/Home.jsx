import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import bannerImage from "../assets/images/banner.png";
import { getToken } from "../utils/auth";

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

// Custom hook: adds 'is-visible' when element scrolls into view
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const navigate = useNavigate();
  useReveal();

  const [showBrowse, setShowBrowse] = useState(false);
  const [properties, setProperties] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const propertiesRef = useRef(null);

  useEffect(() => {
    if (showBrowse) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [propRes, orderRes] = await Promise.all([
            fetch("http://localhost:5000/api/properties", { credentials: "include" }),
            fetch("http://localhost:5000/api/orders", { credentials: "include" }),
          ]);
          if (propRes.ok) {
            const propData = await propRes.json();
            setProperties(propData.properties || []);
          }
          if (orderRes.ok) {
            const orderData = await orderRes.json();
            setOrders(orderData.orders || []);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [showBrowse]);

  const handleBrowse = () => {
    const isLogged = getToken();
    if (isLogged) {
      navigate("/accessible-home");
    } else {
      setShowBrowse(true);
      setTimeout(() => {
        propertiesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="container nav">
          <a className="brand" href="#">
            <div className="logo">🏠</div>
            <div className="brand-text">
              <h1>GhorKhuji</h1>
              <p>Find home easily</p>
            </div>
          </a>

          <nav className="menu">
            <a href="#home">Home</a>
            <a href="#">Search</a>
            <a href="#">Post Property</a>
            <a href="#">Contact</a>
          </nav>

          <div className="nav-actions">
            {/* Login */}
            <button
              type="button"
              className="btn btn-light"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            {/* Register */}
            <Link to="/register" className="btn btn-dark">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        id="home"
        className="hero-banner"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="banner-overlay">
          {/* Category Bar */}
          <div className="category-bar inside-banner">
            <div className="container category-wrapper">
              {[
                "Family",
                "Bachelor",
                "Office",
                "Sublet",
                "Hostel",
                "Shop",
                "New Flat",
              ].map((item) => (
                <a key={item} href="#" className="category-item">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Banner Content */}
          <div className="container banner-content">
            <h2>বাসা খুঁজুন সহজেই</h2>
            <p>Find your perfect home quickly and easily</p>
            <button onClick={handleBrowse} className="btn btn-dark">
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="container">
          <h2 className="section-title reveal reveal-up">Why GhorKhuji?</h2>
          <p className="section-subtitle reveal reveal-up reveal-delay-1">
            Simple, fast and reliable platform for house seekers and owners.
          </p>

          <div className="grid-3">
            <div className="feature reveal reveal-up reveal-delay-1">
              <h3>Smart Search</h3>
              <p className="muted">
                Filter by area, price, rooms, and amenities to find the best
                match.
              </p>
            </div>

            <div className="feature reveal reveal-up reveal-delay-2">
              <h3>Owner Connect</h3>
              <p className="muted">
                Contact owners directly and manage conversations easily.
              </p>
            </div>

            <div className="feature reveal reveal-up reveal-delay-3">
              <h3>Save Favorites</h3>
              <p className="muted">
                Bookmark listings you like and revisit anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section id="categories" className="section alt">
        <div className="container">
          <h2 className="section-title reveal reveal-fade">Explore Categories</h2>

          <div className="grid-3">
            <a className="category-card reveal reveal-left reveal-delay-1" href="#">
              <h3>Flat Rent</h3>
              <p className="muted">
                Find flats by budget, rooms and amenities.
              </p>
              <span className="browseLink">Browse →</span>
            </a>

            <a className="category-card reveal reveal-up reveal-delay-2" href="#">
              <h3>Hostel / Mess</h3>
              <p className="muted">
                Seat-based options for students & bachelors.
              </p>
              <span className="browseLink">Browse →</span>
            </a>

            <a className="category-card reveal reveal-right reveal-delay-3" href="#">
              <h3>For Sale</h3>
              <p className="muted">
                Apartments & houses for buying with details.
              </p>
              <span className="browseLink">Browse →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Revealed Content */}
      {showBrowse && (
        <div ref={propertiesRef} className="revealed-container">
          {/* Properties Section */}
          <section id="properties-list" className="section">
            <div className="container">
              <h2 className="section-title">🏠 Available Properties</h2>
              <p className="section-subtitle">Browse available listings curated for you.</p>

              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="grid-3">
                  {properties.slice(0, 6).map((item) => (
                    <div className="property-card" key={item._id}>
                      <div className="property-img-wrap">
                        <img
                          src={item.images?.[0] || categoryImages[item.category] || categoryImages["Family"]}
                          alt={item.shortAddress}
                          className="property-img"
                        />
                        <span className="cat-badge">{item.category}</span>
                      </div>
                      <div className="property-body">
                        <h3>{item.propertyType} — {item.area}</h3>
                        <p className="prop-address">📍 {item.shortAddress}</p>
                        <div className="prop-footer">
                          <strong className="prop-price">৳ {Number(item.price).toLocaleString()}</strong>
                        </div>
                        <button
                          className="btn btn-dark property-btn"
                          onClick={() => getToken() ? navigate(`/property/${item._id}`) : navigate("/login")}
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

          {/* Orders Section */}
          <section id="orders-list" className="section alt">
            <div className="container">
              <h2 className="section-title">🔍 Looking For a Home</h2>
              <p className="section-subtitle">Tenants actively searching for a place to rent.</p>

              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="grid-3">
                  {orders.slice(0, 6).map((item) => (
                    <div className="order-card" key={item._id}>
                      <div className="order-card-header">
                        <span className="order-badge">{item.category}</span>
                      </div>
                      <div className="order-card-body">
                        <h3 className="order-location">📍 {item.locations?.[0]?.area || "Unknown"}</h3>
                        <div className="order-footer">
                          <strong className="order-budget">৳ {Number(item.maxBudget).toLocaleString()} max</strong>
                        </div>
                        <button
                          className="btn btn-order order-contact-btn"
                          onClick={() => getToken() ? navigate(`/order/${item._id}`) : navigate("/login")}
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
        </div>
      )}

      {/* How it works */}
      <section id="how" className="section">
        <div className="container">
          <h2 className="section-title reveal reveal-up">How it works</h2>

          <div className="steps">
            <div className="step reveal reveal-left reveal-delay-1">
              <div className="step-no">1</div>
              <div>
                <h3>Create Account</h3>
                <p className="muted">
                  Register as House Seeker, Property Owner, or both.
                </p>
              </div>
            </div>

            <div className="step reveal reveal-left reveal-delay-2">
              <div className="step-no">2</div>
              <div>
                <h3>Search / Post</h3>
                <p className="muted">
                  Seekers search listings. Owners post and manage properties.
                </p>
              </div>
            </div>

            <div className="step reveal reveal-left reveal-delay-3">
              <div className="step-no">3</div>
              <div>
                <h3>Connect</h3>
                <p className="muted">
                  Message and finalize visit/booking quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container footer-grid">
          <div className="reveal reveal-up reveal-delay-1">
            <h3>GhorKhuji</h3>
            <p className="footer-muted">
              A simple platform to connect house seekers and property owners.
            </p>
          </div>

          <div className="reveal reveal-up reveal-delay-2">
            <h4>Quick Links</h4>
            <a href="#">Search</a>
            <a href="#">Register</a>
            <a href="#">Login</a>
          </div>

          <div className="reveal reveal-up reveal-delay-3">
            <h4>Support</h4>
            <p className="footer-muted">Email: support@ghorkhuji.com</p>
            <p className="footer-muted">Phone: +8801712345678</p>
          </div>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} GhorKhuji. All rights reserved.
        </div>
      </footer>
    </div>
  );
}