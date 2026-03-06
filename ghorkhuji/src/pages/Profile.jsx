import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Profile</h1>
      <p><strong>Name:</strong> {user?.name || "User"}</p>
      <p><strong>Email:</strong> {user?.email || "No email"}</p>

      <button onClick={() => navigate("/accessible-home")}>Back to Home</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
}