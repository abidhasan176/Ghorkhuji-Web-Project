import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import bannerImage from "../assets/images/banner.png";
import { getToken } from "../utils/auth";

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

  const handleBrowse = () => {
    navigate("/accessible-home");
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