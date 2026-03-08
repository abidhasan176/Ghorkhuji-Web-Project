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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneTrim,
          password: passTrim,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

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

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
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
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#0d1117",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg,#1f6feb,#58a6ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 24px rgba(31,111,235,0.35)",
              flexShrink: 0,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10.5L12 3L21 10.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 9.5V20H18V9.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 20V14H14V20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            style={{
              margin: 0,
              color: "#f0f6fc",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.4px",
            }}
          >
            Sign in to GhorKhuji
          </h1>
        </div>

        <div
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          }}
        >
          {errorMsg && (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(248,81,73,0.12)",
                border: "1px solid rgba(248,81,73,0.35)",
                color: "#ffb4a9",
                fontSize: 14,
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#f0f6fc",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Phone number
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  height: 46,
                  minWidth: 72,
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #30363d",
                  borderRadius: 10,
                  background: "#0d1117",
                  color: "#e6edf3",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
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

            {phoneError && (
              <div style={{ color: "#ff7b72", marginTop: 6, fontSize: 13 }}>
                {phoneError}
              </div>
            )}

            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{
                    color: "#f0f6fc",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Password
                </label>

                <span
                  style={{
                    color: "#58a6ff",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </span>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  ref={passRef}
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  placeholder="Enter password"
                  style={{ ...inputStyle(Boolean(passError)), paddingRight: 70 }}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#58a6ff",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {passError && (
                <div style={{ color: "#ff7b72", marginTop: 6, fontSize: 13 }}>
                  {passError}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                style={{
                  width: 16,
                  height: 16,
                  cursor: "pointer",
                  margin: 0,
                }}
              />
              <label
                htmlFor="remember"
                style={{
                  color: "#c9d1d9",
                  fontSize: 14,
                  cursor: "pointer",
                  lineHeight: 1.3,
                }}
              >
                Remember this phone number
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 20,
                width: "100%",
                height: 48,
                borderRadius: 10,
                border: "none",
                background: "#238636",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(35,134,54,0.28)",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div
              style={{
                margin: "18px 0 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#8b949e",
                fontSize: 13,
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#30363d" }} />
              <span>or</span>
              <div style={{ flex: 1, height: 1, background: "#30363d" }} />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 10,
                border: "1px solid #d0d7de",
                background: "#ffffff",
                color: "#24292f",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.227 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.841 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.841 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.205 0-9.617-3.316-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-.793 2.236-2.231 4.166-4.084 5.57l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: "15px 16px",
            border: "1px solid #30363d",
            borderRadius: 16,
            textAlign: "center",
            background: "#161b22",
            color: "#c9d1d9",
            fontSize: 15,
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#58a6ff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}