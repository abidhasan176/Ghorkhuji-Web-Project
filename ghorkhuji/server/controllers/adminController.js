import User from "../models/User.js";
import Property from "../models/Property.js";
import Transaction from "../models/TransactionModel.js";

// ============================================================
// GET /api/admin/dashboard-stats
// Returns aggregated stats for the admin dashboard
// ============================================================
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ isActive: true });

    // 2. Financial Metrics (Aggregate successful transactions)
    const financialStats = await Transaction.aggregate([
      { $match: { status: "success" } },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: "$amount" },
          successfulBookings: { $sum: 1 } 
        } 
      }
    ]);
    const revenue = financialStats.length > 0 ? financialStats[0].totalRevenue : 0;
    const successfulBookings = financialStats.length > 0 ? financialStats[0].successfulBookings : 0;

    // 3. User Growth (Signups by month for charts)
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format months for the frontend chart
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedUserGrowth = userGrowth.map(item => ({
      name: monthNames[item._id - 1] || "Unknown",
      users: item.count
    }));

    // 4. Property Distribution by Category
    const propertyCategories = await Property.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 }
        }
      }
    ]);
    const formattedCategories = propertyCategories.map(item => ({
      name: item._id,
      value: item.value
    }));

    // 5. Recent Transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name phone")
      .populate("propertyId", "shortAddress");

    return res.status(200).json({
      summary: {
        totalUsers,
        totalProperties,
        activeProperties,
        revenue,
        successfulBookings
      },
      charts: {
        userGrowth: formattedUserGrowth,
        propertyCategories: formattedCategories
      },
      recentTransactions
    });

  } catch (err) {
    console.error("❌ Admin Dashboard Error:", err.message);
    return res.status(500).json({ message: "Server error generating admin stats" });
  }
};
