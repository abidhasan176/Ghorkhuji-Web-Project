import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AccessibleHome from "./pages/AccessibleHome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/accessible-home" element={<AccessibleHome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
