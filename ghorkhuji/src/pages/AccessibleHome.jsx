import { useNavigate } from "react-router-dom";
import "./accessibleHome.css";

const categories = ["Family", "Bachelor", "Office", "Sublet", "Hostel", "Shop"];

const properties = [
  {
    id: 1,
    title: "Family Flat",
    location: "Mirpur, Dhaka",
    price: "৳ 18,000 / month",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Bachelor Room",
    location: "Dhanmondi, Dhaka",
    price: "৳ 9,000 / month",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Office Space",
    location: "Motijheel, Dhaka",
    price: "৳ 35,000 / month",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function AccessibleHome() {
  const navigate = useNavigate();

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
            <button className="iconBtn" onClick={() => navigate("/profile")}>
              👤
            </button>
          </div>
        </div>
      </header>

      <section className="hero-banner" id="home">
        <div className="banner-overlay">
          <div className="category-bar inside-banner">
            <div className="container category-wrapper">
              {categories.map((item) => (
                <button key={item} className="category-item">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="banner-content">
            <h2>বাসা খুঁজুন সহজেই</h2>
            <p>Find your perfect home quickly and easily.</p>
            <button className="btn btn-dark">Browse Properties</button>
          </div>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="container">
          <h2 className="section-title">Featured Properties</h2>
          <p className="section-subtitle">Browse the best available listings.</p>

          <div className="grid-3">
            {properties.map((item) => (
              <div className="property-card" key={item.id}>
                <img src={item.image} alt={item.title} className="property-img" />
                <div className="property-body">
                  <h3>{item.title}</h3>
                  <p>{item.location}</p>
                  <strong>{item.price}</strong>
                  <button className="btn btn-dark property-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
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