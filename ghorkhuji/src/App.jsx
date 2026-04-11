import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getToken, logoutUser } from "./utils/auth";

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
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import CarbonFootprintDisplay from "./components/CarbonFootprintDisplay";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth on every navigation
    if (location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/") {
      if (!getToken()) {
        logoutUser().then(() => {
          navigate("/login");
        });
      }
    }
  }, [location, navigate]);

  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/accessible-home"
        element={
          <ProtectedRoute>
            <AccessibleHome />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-property"
        element={
          <ProtectedRoute>
            <AddProperty />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-home"
        element={
          <ProtectedRoute>
            <OrderHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/property/:id"
        element={
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchProperties />
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved-properties"
        element={
          <ProtectedRoute>
            <SavedProperties />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:ownerId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Payment Gateway Routes */}
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-fail" element={<PaymentFail />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />
    </Routes>
    <CarbonFootprintDisplay />
    </>
  );
}

export default App;