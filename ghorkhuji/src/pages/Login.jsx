import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  // already logged in hole accessible home e jabe
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
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
        body: JSON.stringify({ phone: phoneTrim, password: passTrim }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.message || "Login failed. Please try again.");
        return;
      }

      // user save korbe always, na hole login thakbe na
      localStorage.setItem("user", JSON.stringify(data.user || data));

      // remember me only phone save/remove korbe
      if (remember) {
        localStorage.setItem("rememberedPhone", phoneTrim);
      } else {
        localStorage.removeItem("rememberedPhone");
      }

      navigate("/accessible-home");
    } catch (err) {
      console.log(err);
      setErrorMsg("Server not reachable / Network error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (bad) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: bad ? "1px solid #ef4444" : "1px solid #e2e8f0",
    outline: "none",
    fontSize: 14,
    background: "white",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.92)",
          borderRadius: 18,
          padding: 22,
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "white",
              fontSize: 20,
            }}
          >
            🏠
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>
              Welcome back
            </h2>
            <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>
              Login to continue to GhorKhuji
            </p>
          </div>
        </div>

        {errorMsg ? (
          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 14,
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={handleLogin} style={{ marginTop: 18 }}>
          <label style={{ display: "block", fontWeight: 600, color: "#0f172a" }}>
            Phone No <span style={{ color: "#ef4444" }}>*</span>
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                minWidth: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              +880
            </div>

            <input
              ref={phoneRef}
              autoFocus
              type="text"
              placeholder="17XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  passRef.current?.focus();
                }
              }}
              style={inputStyle(Boolean(phoneError))}
            />
          </div>

          {phoneError ? (
            <div style={{ marginTop: 6, color: "#ef4444", fontSize: 12, fontWeight: 700 }}>
              {phoneError}
            </div>
          ) : null}

          <div style={{ marginTop: 14 }}>
            <label style={{ display: "block", fontWeight: 600, color: "#0f172a" }}>
              Password <span style={{ color: "#ef4444" }}>*</span>
            </label>

            <div style={{ position: "relative", marginTop: 8 }}>
              <input
                ref={passRef}
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                style={{ ...inputStyle(Boolean(passError)), paddingRight: 64 }}
              />

              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#2563eb",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {passError ? (
              <div style={{ marginTop: 6, color: "#ef4444", fontSize: 12, fontWeight: 700 }}>
                {passError}
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#334155",
                fontWeight: 700,
              }}
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              fontWeight: 800,
              fontSize: 15,
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ marginTop: 14, textAlign: "center", color: "#475569" }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "#2563eb", fontWeight: 800 }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}