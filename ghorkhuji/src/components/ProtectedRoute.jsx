import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getToken, logoutUser } from "../utils/auth";
import { apiFetch } from "../utils/api";

const SESSION_CHECK_INTERVAL = 5000; // ms — how often we ping /api/auth/me

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState("checking"); // "checking" | "ok" | "fail"
  const intervalRef = useRef(null);

  // One-time mount check: does the user have the auth cookie AND a valid server session?
  useEffect(() => {
    if (!getToken()) {
      // No client-side flag cookie → immediate fail
      setAuthStatus("fail");
      return;
    }
    // Validate with the server
    apiFetch("http://localhost:5000/api/auth/me")
      .then((res) => {
        if (res.ok) {
          setAuthStatus("ok");
        } else {
          setAuthStatus("fail");
        }
      })
      .catch(() => {
        // Network error — allow if cookie present (offline-friendly)
        setAuthStatus(getToken() ? "ok" : "fail");
      });
  }, [location.pathname]); // re-check on every route change

  // Periodic background check every 5 s (catches manual cookie deletion)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!getToken()) {
        clearInterval(intervalRef.current);
        logoutUser().then(() =>
          navigate("/login", { state: { sessionExpired: true }, replace: true })
        );
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  if (authStatus === "checking") {
    // Minimal loading — invisible flash, not a full-page spinner
    return (
      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0f172a",
      }}>
        <div style={{
          width: 40, height: 40,
          border: "3px solid rgba(99,102,241,0.2)",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (authStatus === "fail") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, sessionExpired: true }}
      />
    );
  }

  return children;
}