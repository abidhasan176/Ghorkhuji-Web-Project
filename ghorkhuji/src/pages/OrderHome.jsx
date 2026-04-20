import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./OrderHome.css";

export default function OrderHome() {
  const navigate = useNavigate();

  // Location array — "Add More Location" বাটনে ক্লিক করলে নতুন row যোগ হবে
  const [locations, setLocations] = useState([
    { division: "", district: "", area: "" }
  ]);

  // বাকি সব ফর্ম ফিল্ডের ডেটা এখানে store হবে
  const [form, setForm] = useState({
    category: "", gender: "", room: "", bathroom: "", needFrom: "", maxBudget: "",
    kitchen: "", gas: "", livingSpace: "", roomSharing: "",
    floorPreference: "", lift: "", parking: "",
    detailedAddress: "",
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: true });

  // Location ফিল্ড পরিবর্তন হলে
  const handleLocationChange = (index, e) => {
    const { name, value } = e.target;
    setLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, [name]: value } : loc))
    );
  };

  // বাকি ফিল্ড পরিবর্তন হলে
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Create বাটনে ক্লিক করলে এই ফাংশন চলবে
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", ok: true });

    try {
      const res = await apiFetch("http://localhost:5000/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          locations,
          maxBudget: Number(form.maxBudget),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "✅ Order posted successfully!", ok: true });
        setTimeout(() => navigate("/accessible-home"), 1500);
      } else {
        setMessage({ text: "❌ " + (data.message || "Something went wrong"), ok: false });
      }
    } catch (err) {
      setMessage({ text: "❌ Server error. Make sure the server is running.", ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">

        <p className="breadcrumb">Orders &gt; Create</p>
        <h1>Create Order</h1>

        <div className="info-box">
          আপনার চাহিদা অনুযায়ী বাসা খুঁজে পেতে ফর্মটি সঠিকভাবে পূরণ করুন। আমাদের অভিজ্ঞ প্রতিনিধিরা ৭ দিনের মধ্যে আপনার জন্য উপযুক্ত বাসা খুঁজে দিবে।
        </div>

        {/* সাবমিটের পরে সাকসেস বা এরর মেসেজ দেখাবে */}
        {message.text && (
          <div className="info-box" style={{ color: message.ok ? "green" : "red" }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* LOCATION */}
          <div className="form-card">
            <h2>Location Information</h2>

            <div className="grid-3">
              <div>
                <label>Division *</label>
                <select name="division" value={locations[0].division} onChange={(e) => handleLocationChange(0, e)} required>
                  <option value="">Select an option</option>
                  <option>Dhaka</option><option>Chittagong</option><option>Rajshahi</option>
                  <option>Khulna</option><option>Barishal</option><option>Sylhet</option>
                  <option>Rangpur</option><option>Mymensingh</option>
                </select>
              </div>

              <div>
                <label>District *</label>
                <select name="district" value={locations[0].district} onChange={(e) => handleLocationChange(0, e)} required>
                  <option value="">Select an option</option>
                  <option>Dhaka</option><option>Gazipur</option><option>Narayanganj</option>
                  <option>Chittagong</option><option>Rajshahi</option><option>Khulna</option>
                  <option>Cumilla</option><option>Mymensingh</option>
                </select>
              </div>

              <div>
                <label>Area *</label>
                <select name="area" value={locations[0].area} onChange={(e) => handleLocationChange(0, e)} required>
                  <option value="">Select an option</option>
                  <option>Mirpur</option><option>Dhanmondi</option><option>Uttara</option>
                  <option>Mohammadpur</option><option>Gulshan</option><option>Banani</option>
                  <option>Motijheel</option><option>Old Dhaka</option><option>Bashundhara</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Detailed Location / Address (Block, Road, Sector, etc.)</label>
              <input 
                type="text" 
                name="detailedAddress" 
                value={form.detailedAddress} 
                onChange={handleChange} 
                placeholder="e.g. Block C, Road 5, Sector 10" 
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "8px" }}
              />
            </div>
          </div>

          {/* PRIMARY REQUIREMENTS */}
          <div className="form-card">
            <h2>Primary Requirements</h2>

            <div className="grid-3">
              <div>
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Family</option><option>Bachelor</option><option>Office</option>
                  <option>Sublet</option><option>Hostel</option><option>Shop</option>
                </select>
              </div>

              <div>
                <label>Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Male</option><option>Female</option><option>Any</option>
                </select>
              </div>

              <div>
                <label>Room *</label>
                <select name="room" value={form.room} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>1</option><option>2</option><option>3</option>
                  <option>4</option><option>5+</option>
                </select>
              </div>

              <div>
                <label>Bath room *</label>
                <select name="bathroom" value={form.bathroom} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>1</option><option>2</option><option>3</option><option>4+</option>
                </select>
              </div>

              <div>
                <label>Need From *</label>
                <select name="needFrom" value={form.needFrom} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>January</option><option>February</option><option>March</option>
                  <option>April</option><option>May</option><option>June</option>
                  <option>July</option><option>August</option><option>September</option>
                  <option>October</option><option>November</option><option>December</option>
                </select>
              </div>

              <div>
                <label>Maximum Total Budget *</label>
                <input type="number" name="maxBudget" value={form.maxBudget} onChange={handleChange} placeholder="BDT" required />
              </div>
            </div>
          </div>

          {/* ADDITIONAL */}
          <div className="form-card">
            <h2>Additional Requirements</h2>

            <div className="grid-3">
              <div>
                <label>Kitchen facility</label>
                <select name="kitchen" value={form.kitchen} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Yes</option><option>No</option>
                </select>
              </div>

              <div>
                <label>Gas facility</label>
                <select name="gas" value={form.gas} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Yes</option><option>No</option>
                </select>
              </div>

              <div>
                <label>Living space</label>
                <select name="livingSpace" value={form.livingSpace} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Yes</option><option>No</option>
                </select>
              </div>

              <div>
                <label>Room sharing</label>
                <select name="roomSharing" value={form.roomSharing} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Yes</option><option>No</option>
                </select>
              </div>

              <div>
                <label>Floor preference</label>
                <select name="floorPreference" value={form.floorPreference} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Ground</option><option>1st</option><option>2nd</option>
                  <option>3rd</option><option>4th</option><option>5th+</option>
                  <option>Any</option>
                </select>
              </div>

              <div>
                <label>Lift facility</label>
                <select name="lift" value={form.lift} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Yes</option><option>No</option>
                </select>
              </div>

              <div>
                <label>Parking facility</label>
                <select name="parking" value={form.parking} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Yes</option><option>No</option>
                </select>
              </div>
            </div>
          </div>

          {/* PACKAGE */}
          <div className="form-card">
            <h3>Package : 7 Days (Price : 1,000 BDT)</h3>

            <label className="checkbox">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={form.agreedToTerms}
                onChange={handleChange}
                required
              />
              I agree to the Terms &amp; Conditions, Privacy Policy, and Refund Policy
            </label>
          </div>

          <div className="btn-group">
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Posting..." : "Create"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/accessible-home")}>
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}