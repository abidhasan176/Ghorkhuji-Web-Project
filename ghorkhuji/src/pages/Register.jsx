import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { saveAuth } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    countryCode: "+880",
    phone: "",
    password: "",
    referral: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return alert("Full Name is required");
    if (!form.phone.trim()) return alert("Phone No is required");
    if (!form.password.trim()) return alert("Password is required");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      saveAuth(data.token, data.user);
      alert(data.message || "Registered ✅");
      navigate("/accessible-home");
    } catch (err) {
      console.error(err);
      alert("Server not reachable / Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <h1 className="authTitle">Register</h1>

        <form onSubmit={onSubmit} className="authForm">
          <label className="label">
            Full Name <span className="req">*</span>
          </label>
          <input
            className="input"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter your full name"
          />

          <label className="label">
            Phone No <span className="req">*</span>
          </label>
          <div className="phoneRow">
            <div className="countryBox">
              <span className="phoneIcon">📱</span>
              <input
                className="countryInput"
                name="countryCode"
                value={form.countryCode}
                onChange={onChange}
              />
            </div>

            <input
              className="input phoneInput"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Enter phone number"
            />
          </div>

          <label className="label">
            Password <span className="req">*</span>
          </label>
          <div className="passWrap">
            <input
              className="input"
              name="password"
              value={form.password}
              onChange={onChange}
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
            />
            <button
              type="button"
              className="showBtn"
              onClick={() => setShowPass((s) => !s)}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          <label className="label">Referral Code (Optional)</label>
          <input
            className="input"
            name="referral"
            value={form.referral}
            onChange={onChange}
            placeholder="Enter referral code (optional)"
          />

          <button className="primaryBtn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <button type="button" className="linkBtn">
            Change Country
          </button>

          <div className="bottomLinks">
            <div className="muted">
              Already have account? <Link to="/login">Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}