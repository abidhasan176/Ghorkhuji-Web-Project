import "./AddProperty.css";

export default function AddProperty() {
  return (
    <div className="add-property-page">
      <div className="add-container">

        <p className="breadcrumb">Posts &gt; Create</p>
        <h1>Create Post</h1>

        <div className="info-box">
          দ্রুত ভাড়াটিয়া পাওয়ার জন্য সঠিক তথ্য ও স্পষ্ট ছবি সংযুক্ত করে ফর্মটি পূরণ করুন।
        </div>

        {/* BASIC INFO */}
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="grid-3">
            <div>
              <label>Month *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Category *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Property Type *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Bedroom *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Bathroom *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Balcony</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Floor</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Gender *</label>
              <select><option>Select an option</option></select>
            </div>

            <div>
              <label>Size (Square Feet)</label>
              <input type="text" />
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="form-section">
          <h2>Location Information</h2>

          <div className="grid-2">
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

            <div>
              <label>Sector no</label>
              <input type="text" />
            </div>

            <div>
              <label>Road no</label>
              <input type="text" />
            </div>

            <div>
              <label>House no</label>
              <input type="text" />
            </div>

            <div className="full">
              <label>Short Address *</label>
              <input type="text" />
            </div>
          </div>
        </div>

        {/* ADDITIONAL */}
        <div className="form-section">
          <h2>Additional Information</h2>

          <label>
            Property Details ( Address and phone number cannot be provided here )
          </label>

          <textarea rows="6"></textarea>
        </div>

        {/* IMAGE */}
        <div className="form-section">
          <h2>Images</h2>

          <div className="upload-box">
            Drag & Drop your files or <span>Browse</span>
          </div>
        </div>

        {/* PRICE */}
        <div className="form-section">
          <h2>Price</h2>

          <label>Price *</label>
          <input type="number" placeholder="BDT" />

          <label>Price type</label>
          <select>
            <option>Monthly</option>
          </select>

          <div className="price-includes">
            <p>Price includes</p>

            <div className="switch-row">Electricity bill</div>
            <div className="switch-row">Gas bill</div>
            <div className="switch-row">Water bill</div>
            <div className="switch-row">Lift bill</div>
            <div className="switch-row">Security bill</div>
          </div>
        </div>

        <div className="buttons">
          <button className="create-btn">Create</button>
          <button className="cancel-btn">Cancel</button>
        </div>

      </div>
    </div>
  );
}