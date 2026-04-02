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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: phoneTrim,
          password: passTrim
        })
      });

      console.log("Raw response:", res);

      const data = await res.json();
      console.log("LOGIN RESPONSE DATA =", data);

      if (!res.ok) {
        setErrorMsg(data?.message || "Login failed");
        return;
      }

      saveAuth(data.token, data.user);

      if (remember) {
        localStorage.setItem("rememberedPhone", phoneTrim);
      } else {
        localStorage.removeItem("rememberedPhone");
      }

      navigate("/accessible-home");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
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
    background: "white"
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "linear-gradient(135deg,#0f172a,#1e293b)"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.92)",
          borderRadius: 18,
          padding: 22,
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)"
        }}
      >
        <h2 style={{ margin: 0 }}>Login</h2>

        {errorMsg && (
          <div style={{ color: "red", marginTop: 10 }}>{errorMsg}</div>
        )}

        <form onSubmit={handleLogin} style={{ marginTop: 18 }}>
          <label>Phone</label>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <div
              style={{
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                background: "#f8fafc"
              }}
            >
              +880
            </div>

            <input
              ref={phoneRef}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle(Boolean(phoneError))}
            />
          </div>

          {phoneError && <div style={{ color: "red" }}>{phoneError}</div>}

          <div style={{ marginTop: 14 }}>
            <label>Password</label>

            <div style={{ position: "relative", marginTop: 8 }}>
              <input
                ref={passRef}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle(Boolean(passError)), paddingRight: 60 }}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer"
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {passError && <div style={{ color: "red" }}>{passError}</div>}
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember phone
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 18,
              width: "100%",
              padding: "12px",
              borderRadius: 14,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ marginTop: 14 }}>
            Don't have account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}