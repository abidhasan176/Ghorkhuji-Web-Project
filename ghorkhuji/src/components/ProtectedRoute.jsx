import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getToken, logoutUser } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const token = getToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    // Periodic check to catch manual cookie deletion or expiration
    const interval = setInterval(() => {
      if (!getToken()) {
        logoutUser().then(() => {
          navigate("/login");
        });
      }
      // Force a re-render to re-check 'token' if needed
      setTick(t => t + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}