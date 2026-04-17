import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, logoutUser } from "./utils/auth";
import { initApiNavigate } from "./utils/api";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccessibleHome from "./pages/AccessibleHome";
import Profile from "./pages/Profile";
import AddProperty from "./pages/AddProperty";
import OrderHome from "./pages/OrderHome";
import PropertyDetails from "./pages/PropertyDetails";
import OrderDetails from "./pages/OrderDetails";
import SavedProperties from "./pages/SavedProperties";
import SearchProperties from "./pages/SearchProperties";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import CarbonFootprintDisplay from "./components/CarbonFootprintDisplay";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import PaymentCancel from "./pages/PaymentCancel";

// Public routes that don't need auth checks
const PUBLIC_PATHS = ["/", "/login", "/register"];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionBanner, setSessionBanner] = useState("");

  // Give the api utility a reference to navigate so it can redirect on 401
  useEffect(() => {
    initApiNavigate(navigate);
  }, [navigate]);

  // Show "session expired" banner when Login page is reached with that state
  useEffect(() => {
    if (location.pathname === "/login" && location.state?.sessionExpired) {
      setSessionBanner("Your session has expired. Please log in again.");
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, "");
      const t = setTimeout(() => setSessionBanner(""), 5000);
      return () => clearTimeout(t);
    }
  }, [location]);

  // Global route guard — runs on every navigation
  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(location.pathname);
    if (!isPublic && !getToken()) {
      logoutUser().then(() =>
        navigate("/login", {
          state: { sessionExpired: true },
          replace: true,
        })
      );
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {/* Session-expired toast */}
      {sessionBanner && (
        <div
          id="session-expired-banner"
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 8px 24px rgba(239,68,68,0.45)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "slideDown 0.35s ease",
          }}
        >
          <span>🔒</span>
          {sessionBanner}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/accessible-home" element={<ProtectedRoute><AccessibleHome /></ProtectedRoute>} />
        <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/add-property"    element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/order-home"      element={<ProtectedRoute><OrderHome /></ProtectedRoute>} />
        <Route path="/property/:id"    element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
        <Route path="/order/:id"       element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/search"          element={<ProtectedRoute><SearchProperties /></ProtectedRoute>} />
        <Route path="/saved-properties" element={<ProtectedRoute><SavedProperties /></ProtectedRoute>} />
        <Route path="/chat"            element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/chat/:ownerId"   element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/admin"           element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* Payment Gateway Routes (public — SSLCommerz redirects here) */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-fail"    element={<PaymentFail />} />
        <Route path="/payment-cancel"  element={<PaymentCancel />} />
      </Routes>

      <CarbonFootprintDisplay />
    </>
  );
}

export default App;