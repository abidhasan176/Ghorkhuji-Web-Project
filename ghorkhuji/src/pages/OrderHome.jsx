import "./OrderHome.css";

export default function OrderHome() {
  return (
    <div className="order-page">
      <div className="order-container">

        <p className="breadcrumb">Orders &gt; Create</p>
        <h1>Create Order</h1>

        <div className="info-box">
          আপনার চাহিদা অনুযায়ী বাসা খুঁজে পেতে ফর্মটি সঠিকভাবে পূরণ করুন। আমাদের অভিজ্ঞ প্রতিনিধিরা ৭ দিনের মধ্যে আপনার জন্য উপযুক্ত বাসা খুঁজে দিবে।
        </div>

        {/* LOCATION */}
        <div className="form-card">
          <h2>Location</h2>

          <div className="grid-3">
            <div>
              <label>Division *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>District *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Area *</label>
              <select><option>Select an option</option></select>
            </div>
          </div>

          <button className="add-location">Add More Location</button>
        </div>

        {/* PRIMARY REQUIREMENTS */}
        <div className="form-card">
          <h2>Primary Requirements</h2>

          <div className="grid-3">

            <div>
              <label>Category *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Gender *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Room *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Bath room *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Need From *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Maximum Total Budget *</label>
              <input type="number" placeholder="BDT" />
            </div>

          </div>
        </div>

        {/* ADDITIONAL */}
        <div className="form-card">
          <h2>Additional Requirements</h2>

          <div className="grid-3">

            <div>
              <label>Kitchen facility</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Gas facility</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Living space</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Room sharing</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Floor preference</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Lift facility</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Parking facility</label>
              <select><option>Select an option</option></select>
            </div>

          </div>
        </div>

        {/* PACKAGE */}
        <div className="form-card">
          <h3>Package : 7 Days (Price : 1,000 BDT)</h3>

          <label className="checkbox">
            <input type="checkbox" />
            I agree to the Terms & Conditions, Privacy Policy, and Refund Policy
          </label>
        </div>

        <div className="btn-group">
          <button className="create-btn">Create</button>
          <button className="cancel-btn">Cancel</button>
        </div>

      </div>
    </div>
  );
}