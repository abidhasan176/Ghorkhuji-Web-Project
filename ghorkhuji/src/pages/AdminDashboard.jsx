import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import "./AdminDashboard.css";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard-stats", {
          credentials: "include"
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setError("Failed to load dashboard data. Are you an admin?");
        }
      } catch (err) {
        setError("Network error fetching dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <span>⚠️</span>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="btn-return">Return Home</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>GhorKhuji Admin Panel</h1>
        <p>System Overview & Analytics</p>
      </div>

      <div className="admin-summary-cards">
        <div className="admin-card">
          <div className="admin-card-icon user-icon">👥</div>
          <div className="admin-card-info">
            <h3>Total Users</h3>
            <p>{stats.summary.totalUsers}</p>
          </div>
        </div>
        
        <div className="admin-card">
          <div className="admin-card-icon prop-icon">🏠</div>
          <div className="admin-card-info">
            <h3>Active Properties</h3>
            <p>{stats.summary.activeProperties} <span className="sub-text">/ {stats.summary.totalProperties} Total</span></p>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon book-icon">🎟️</div>
          <div className="admin-card-info">
            <h3>Successful Bookings</h3>
            <p>{stats.summary.successfulBookings}</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon rev-icon">৳</div>
          <div className="admin-card-info">
            <h3>Total Revenue</h3>
            <p>৳ {stats.summary.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="admin-charts-section">
        <div className="admin-chart-box">
          <h3>User Growth (Current Year)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.charts.userGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <LineTooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-chart-box">
          <h3>Properties by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.charts.propertyCategories} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <LineTooltip />
              <Legend />
              <Bar dataKey="value" name="Total Properties" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-transactions-section">
        <h3>Recent Transactions</h3>
        {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Property</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td><span className="mono">{tx.transactionId}</span></td>
                    <td>{tx.userId?.name || "Unknown"}</td>
                    <td>{tx.propertyId?.shortAddress || "Unknown"}</td>
                    <td>৳ {tx.amount}</td>
                    <td>
                      <span className={`status-badge status-${tx.status}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data-text">No recent transactions to display.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
