import { Routes, Route } from "react-router-dom";

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

function App() {
  return (
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
    </Routes>
  );
}

export default App;