import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccessibleHome from "./pages/AccessibleHome";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/accessible-home"
        element={
          <ProtectedRoute>
            <AccessibleHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;