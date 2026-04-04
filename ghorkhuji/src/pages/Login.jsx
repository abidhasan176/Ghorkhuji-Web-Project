import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth, getToken } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const phoneRef = useRef(null);
  const passRef = useRef(null);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState({ phone: false, password: false });

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/accessible-home");
      return;
    }
    const rememberedPhone = localStorage.getItem("rememberedPhone");
    if (rememberedPhone) {
      setPhone(rememberedPhone);
    }
  }, [navigate]);

  const phoneTrim = phone.trim();
  const passTrim = password.trim();

  const phoneError = useMemo(() => {
    if (!touched.phone) return "";
    if (!phoneTrim) return "Phone number required";
    const onlyDigits = phoneTrim.replace(/\D/g, "");
    if (onlyDigits.length < 10) return "Phone number looks too short";
    return "";
  }, [phoneTrim, touched.phone]);

  const passError = useMemo(() => {
    if (!touched.password) return "";
    if (!passTrim) return "Password required";
    if (passTrim.length < 4) return "Password too short";
    return "";
  }, [passTrim, touched.password]);

  const hasAnyError = Boolean(phoneError || passError);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setTouched({ phone: true, password: true });

    if (!phoneTrim || !passTrim) return;
    if (hasAnyError) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: phoneTrim, password: passTrim }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.message || "Login failed");
        return;
      }

      saveAuth(null, data.user);

      if (remember) {
        localStorage.setItem("rememberedPhone", phoneTrim);
      } else {
        localStorage.removeItem("rememberedPhone");
      }

      navigate("/accessible-home");
    } catch (err) {
      setErrorMsg("Server not reachable / Network error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (bad) => ({
    width: "100%",
    height: 46,
    padding: "0 14px",
    borderRadius: 10,
    border: bad ? "1px solid #d1242f" : "1px solid #30363d",
    outline: "none",
    fontSize: 15,
    background: "#ffffff",
    boxSizing: "border-box",
    color: "#24292f",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Blurred background image */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(8px) brightness(0.45)",
        transform: "scale(1.08)",
        zIndex: 0,
      }} />
      {/* Dark overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(10,15,30,0.55)", zIndex: 1 }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#9333ea)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(99,102,241,0.45)", flexShrink: 0 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 10.5L12 3L21 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 9.5V20H18V9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 20V14H14V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ margin: 0, color: "#ffffff", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            Login to GhorKhuji
          </h1>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 24px 48px rgba(0,0,0,0.45)",
        }}>
          {errorMsg && (
            <div style={{ marginBottom: 14, padding: "10px 12px", borderRadius: 8, background: "rgba(248,81,73,0.12)", border: "1px solid rgba(248,81,73,0.35)", color: "#ffb4a9", fontSize: 14 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>
              Phone number
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ height: 46, minWidth: 72, padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 15, fontWeight: 600 }}>
                +880
              </div>
              <input
                ref={phoneRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                placeholder="Enter phone number"
                style={inputStyle(Boolean(phoneError))}
              />
            </div>

            {phoneError && <div style={{ color: "#ff7b72", marginTop: 6, fontSize: 13 }}>{phoneError}</div>}

            <label style={{ display: "block", marginTop: 16, marginBottom: 8, color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                ref={passRef}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                placeholder="Enter password"
                style={{ ...inputStyle(Boolean(passError)), paddingRight: 82 }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{ position: "absolute", right: 8, top: 6, height: 34, padding: "0 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {passError && <div style={{ color: "#ff7b72", marginTop: 6, fontSize: 13 }}>{passError}</div>}

            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember phone
              </label>
              <Link to="/forgot-password" style={{ color: "#58a6ff", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>Forget Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 18, width: "100%", height: 48, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #9333ea)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(99,102,241,0.4)", fontFamily: "inherit" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div style={{ marginTop: 18, textAlign: "center", color: "#8b949e", fontSize: 14 }}>
              Don&apos;t have an account?{" "}
              <Link to="/register" style={{ color: "#58a6ff", textDecoration: "none" }}>Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}