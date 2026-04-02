import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getToken } from "../utils/auth";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          clearAuth();
          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.log(err);
        clearAuth();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Profile</h1>
      <p><strong>Name:</strong> {user?.name || "User"}</p>
      <p><strong>Phone:</strong> {user?.phone || "N/A"}</p>
      <p><strong>Country Code:</strong> {user?.countryCode || "+880"}</p>
      <p><strong>Referral:</strong> {user?.referral || "N/A"}</p>

      <button onClick={() => navigate("/accessible-home")}>Back to Home</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
}