import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProperty.css";

// লাল * চিহ্ন দেখানোর জন্য ছোট কম্পোনেন্ট
const Req = () => <span style={{ color: "red" }}> *</span>;

export default function AddProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    month: "", category: "", propertyType: "", bedroom: "",
    bathroom: "", balcony: "", floor: "", gender: "", size: "",
    division: "", district: "", area: "", block: "", sectorNo: "",
    roadNo: "", houseNo: "", postalCode: "", shortAddress: "",
    details: "", price: "", priceType: "Monthly",
    includesElectricity: false, includesGas: false,
    includesWater: false, includesLift: false, includesSecurity: false,
    includesServant: false, includesNet: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: true });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", ok: true });

    try {
      const res = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "✅ Property posted successfully!", ok: true });
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
    <div className="add-property-page">
      <div className="add-container">

        <p className="breadcrumb">Posts &gt; Create</p>
        <h1>Create Post</h1>

        <div className="info-box">
          দ্রুত ভাড়াটিয়া পাওয়ার জন্য সঠিক তথ্য ও স্পষ্ট ছবি সংযুক্ত করে ফর্মটি পূরণ করুন।
        </div>

        {message.text && (
          <div className="info-box" style={{ color: message.ok ? "green" : "red" }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="grid-3">
              <div>
                <label>Month<Req /></label>
                <select name="month" value={form.month} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>January</option><option>February</option><option>March</option>
                  <option>April</option><option>May</option><option>June</option>
                  <option>July</option><option>August</option><option>September</option>
                  <option>October</option><option>November</option><option>December</option>
                </select>
              </div>

              <div>
                <label>Category<Req /></label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Family</option><option>Bachelor</option><option>Office</option>
                  <option>Sublet</option><option>Hostel</option><option>Shop</option>
                </select>
              </div>

              <div>
                <label>Property Type<Req /></label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Flat</option><option>House</option><option>Room</option>
                  <option>Office</option><option>Shop</option>
                </select>
              </div>

              <div>
                <label>Bedroom<Req /></label>
                <select name="bedroom" value={form.bedroom} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>1</option><option>2</option><option>3</option>
                  <option>4</option><option>5+</option>
                </select>
              </div>

              <div>
                <label>Bathroom<Req /></label>
                <select name="bathroom" value={form.bathroom} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>1</option><option>2</option><option>3</option><option>4+</option>
                </select>
              </div>

              <div>
                <label>Balcony</label>
                <select name="balcony" value={form.balcony} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>None</option><option>1</option><option>2</option><option>3+</option>
                </select>
              </div>

              <div>
                <label>Floor</label>
                <select name="floor" value={form.floor} onChange={handleChange}>
                  <option value="">Select an option</option>
                  <option>Ground</option><option>1st</option><option>2nd</option>
                  <option>3rd</option><option>4th</option><option>5th+</option>
                </select>
              </div>

              <div>
                <label>Gender<Req /></label>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Male</option><option>Female</option><option>Any</option>
                </select>
              </div>

              <div>
                <label>Size (Square Feet)</label>
                <input type="text" name="size" value={form.size} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-section">
            <h2>Location Information</h2>

            <div className="grid-2">
              <div>
                <label>Division<Req /></label>
                <select name="division" value={form.division} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Dhaka</option><option>Chittagong</option><option>Rajshahi</option>
                  <option>Khulna</option><option>Barishal</option><option>Sylhet</option>
                  <option>Rangpur</option><option>Mymensingh</option>
                </select>
              </div>

              <div>
                <label>District<Req /></label>
                <select name="district" value={form.district} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Dhaka</option><option>Gazipur</option><option>Narayanganj</option>
                  <option>Chittagong</option><option>Rajshahi</option><option>Khulna</option>
                  <option>Cumilla</option><option>Mymensingh</option>
                </select>
              </div>

              <div>
                <label>Area<Req /></label>
                <select name="area" value={form.area} onChange={handleChange} required>
                  <option value="">Select an option</option>
                  <option>Mirpur</option><option>Dhanmondi</option><option>Uttara</option>
                  <option>Mohammadpur</option><option>Gulshan</option><option>Banani</option>
                  <option>Motijheel</option><option>Old Dhaka</option><option>Bashundhara</option>
                </select>
              </div>

              <div>
                <label>Block<Req /></label>
                <input type="text" name="block" value={form.block} onChange={handleChange} placeholder="e.g. Block A" required />
              </div>

              <div>
                <label>Sector no<Req /></label>
                <input type="text" name="sectorNo" value={form.sectorNo} onChange={handleChange} placeholder="e.g. 10" required />
              </div>

              <div>
                <label>Road no<Req /></label>
                <input type="text" name="roadNo" value={form.roadNo} onChange={handleChange} placeholder="e.g. 5" required />
              </div>

              <div>
                <label>House no<Req /></label>
                <input type="text" name="houseNo" value={form.houseNo} onChange={handleChange} placeholder="e.g. 12" required />
              </div>

              <div>
                <label>Postal Code<Req /></label>
                <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="e.g. 1216" required />
              </div>

              <div className="full">
                <label>Short Address<Req /></label>
                <input type="text" name="shortAddress" value={form.shortAddress} onChange={handleChange} placeholder="e.g. House 12, Road 5, Block A, Mirpur-10, Dhaka" required />
              </div>
            </div>
          </div>

          {/* ADDITIONAL */}
          <div className="form-section">
            <h2>Additional Information</h2>
            <label>
              Property Details ( Address and phone number cannot be provided here )
            </label>
            <textarea rows="6" name="details" value={form.details} onChange={handleChange}></textarea>
          </div>

          {/* IMAGE */}
          <div className="form-section">
            <h2>Images</h2>
            <div className="upload-box">
              Drag &amp; Drop your files or <span>Browse</span>
            </div>
          </div>

          {/* PRICE */}
          <div className="form-section">
            <h2>Price</h2>

            <label>Price<Req /></label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="BDT" required />

            <label>Price type</label>
            <select name="priceType" value={form.priceType} onChange={handleChange}>
              <option>Monthly</option>
            </select>

            <div className="price-includes">
              <p>Price includes</p>

              <div className="switch-row">
                <input type="checkbox" name="includesElectricity" checked={form.includesElectricity} onChange={handleChange} />
                Electricity bill
              </div>
              <div className="switch-row">
                <input type="checkbox" name="includesGas" checked={form.includesGas} onChange={handleChange} />
                Gas bill
              </div>
              <div className="switch-row">
                <input type="checkbox" name="includesWater" checked={form.includesWater} onChange={handleChange} />
                Water bill
              </div>
              <div className="switch-row">
                <input type="checkbox" name="includesLift" checked={form.includesLift} onChange={handleChange} />
                Lift bill
              </div>
              <div className="switch-row">
                <input type="checkbox" name="includesSecurity" checked={form.includesSecurity} onChange={handleChange} />
                Security bill
              </div>

              {/* Bachelor select করলে এই দুইটা extra option দেখাবে */}
              {form.category === "Bachelor" && (
                <>
                  <div className="switch-row">
                    <input type="checkbox" name="includesServant" checked={form.includesServant} onChange={handleChange} />
                    Servant charge
                  </div>
                  <div className="switch-row">
                    <input type="checkbox" name="includesNet" checked={form.includesNet} onChange={handleChange} />
                    Net (Internet) bill
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="buttons">
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