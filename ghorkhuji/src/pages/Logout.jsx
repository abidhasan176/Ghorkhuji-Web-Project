import { clearAuth } from "../utils/auth"; // Import the clearAuth function
import { useNavigate } from "react-router-dom";

const handleLogout = () => {
  clearAuth(); // Remove token from cookies
  navigate("/login"); // Redirect to login page
};