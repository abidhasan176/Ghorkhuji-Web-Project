# 🏠 ঘরখুঁজি (Ghorkhuji) — আজকের কাজের সম্পূর্ণ রিক্যাপ ও ভাইভা প্রস্তুতি

## 📁 প্রজেক্টের ফোল্ডার স্ট্রাকচার

```
ghorkhuji/
├── server/                         ← 🔥 Backend (তুমি এখানে কাজ করেছ)
│   ├── index.js                    ← [MODIFIED] সার্ভারের মেইন ফাইল
│   ├── models/
│   │   ├── Property.js             ← [NEW] প্রপার্টি ডাটাবেস মডেল
│   │   └── Order.js                ← [NEW] অর্ডার ডাটাবেস মডেল
│   ├── routes/
│   │   ├── authRoutes.js           ← (আগে থেকে ছিল — teammate-এর কাজ)
│   │   ├── propertyRoutes.js       ← [NEW] প্রপার্টি API
│   │   └── orderRoutes.js          ← [NEW] অর্ডার API
│   └── middleware/
│       └── authMiddleware.js       ← (আগে থেকে ছিল — teammate-এর কাজ)
│
└── src/                            ← Frontend (React)
    └── pages/
        ├── AddProperty.jsx         ← [MODIFIED] API ইন্টিগ্রেশন যোগ
        └── OrderHome.jsx           ← [MODIFIED] API ইন্টিগ্রেশন যোগ
```

> [!IMPORTANT]
> মোট **৪টি নতুন ফাইল** তৈরি এবং **৩টি ফাইল মডিফাই** করা হয়েছে। কারো কোনো ডিজাইন (CSS) পরিবর্তন হয়নি।

---

## 🧠 অংশ ১: "আমি কী কী করেছি" — স্যারকে বোঝানোর জন্য

### ✅ কাজ ১: Property Model তৈরি (`server/models/Property.js`)

**এটা কী?** বাড়িওয়ালা (Malik) যখন তার বাড়ি ভাড়া দেওয়ার জন্য পোস্ট করবে, সেই পোস্টের ডাটা MongoDB-তে কীভাবে সেভ হবে — তার কাঠামো (Schema)।

**কোড ব্যাখ্যা:**
```javascript
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    // কোন ইউজার এই পোস্ট করেছে — User মডেলের সাথে রেফারেন্স
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,   // MongoDB-র unique ID
      ref: "User",                            // User collection-এর সাথে link
      required: true,                         // এটা অবশ্যই দিতে হবে
    },

    // Basic Info
    month: { type: String, required: true },       // কোন মাস থেকে available
    category: { type: String, required: true },     // Family / Bachelor / Office
    propertyType: { type: String, required: true }, // Flat / House / Room
    bedroom: { type: String, required: true },
    bathroom: { type: String, required: true },
    gender: { type: String, required: true },       // Male / Female / Any

    // Location Info
    division: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String, required: true },
    block: { type: String, default: "" },           // 🆕 নতুন field
    postalCode: { type: String, default: "" },      // 🆕 নতুন field
    shortAddress: { type: String, required: true },

    // Price
    price: { type: Number, required: true },        // Number type — গাণিতিক কাজ করা যায়

    // Price includes — Boolean ব্যবহার (true/false)
    includesElectricity: { type: Boolean, default: false },
    includesServant: { type: Boolean, default: false },  // 🆕 Bachelor-এর জন্য
    includesNet: { type: Boolean, default: false },      // 🆕 Bachelor-এর জন্য
  },
  { timestamps: true }  // ← এটা দিলে createdAt ও updatedAt নিজে থেকে যোগ হয়
);

export default mongoose.model("Property", propertySchema);
```

> [!TIP]
> **ভাইভায় বলবে:** "Schema হলো ডাটাবেসের ছক (Blueprint)। এটা বলে দেয় কোন ফিল্ডে কী টাইপের ডাটা ঢুকবে। `required: true` মানে সেই ফিল্ড ছাড়া ডাটা সেভ হবে না।"

---

### ✅ কাজ ২: Order Model তৈরি (`server/models/Order.js`)

**এটা কী?** ভাড়াটিয়া যখন বাসা খোঁজার জন্য অর্ডার দেবে, সেই অর্ডারের ডাটা কীভাবে সেভ হবে — তার কাঠামো (Schema)।

**মূল পার্থক্য Property থেকে:**
```javascript
// Order-এ locations একটা Array of Objects — কারণ ভাড়াটিয়া একাধিক এলাকায় বাসা চাইতে পারে
locations: [
  {
    division: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String, required: true },
  },
],

// Package info — নির্দিষ্ট মূল্যে সার্ভিস
packageDays: { type: Number, default: 7 },       // 7 দিনের package
packagePrice: { type: Number, default: 1000 },   // 1,000 BDT
agreedToTerms: { type: Boolean, default: false }, // Terms agree না করলে order হবে না
```

> [!TIP]
> **ভাইভায় বলবে:** "Property মডেলে একটা নির্দিষ্ট লোকেশন থাকে, কিন্তু Order মডেলে `locations` একটা Array। কারণ যে বাসা খুঁজছে সে হয়তো Mirpur বা Dhanmondi — দুই জায়গাতেই খুঁজতে চায়।"

---

### ✅ কাজ ৩: Property Routes তৈরি (`server/routes/propertyRoutes.js`)

**এটা কী?** API Endpoint — মানে ব্রাউজার বা ফ্রন্টএন্ড কোন URL-এ data পাঠালে সার্ভার কী করবে সেটা নির্ধারণ করে।

**৪টি Endpoint তৈরি হয়েছে:**

| HTTP Method | URL | কাজ | Auth লাগবে? |
|---|---|---|---|
| `POST` | `/api/properties` | নতুন property পোস্ট করা | ✅ হ্যাঁ |
| `GET` | `/api/properties` | সব property দেখা | ❌ না |
| `GET` | `/api/properties/:id` | নির্দিষ্ট একটা দেখা | ❌ না |
| `DELETE` | `/api/properties/:id` | নিজের property মুছে ফেলা | ✅ হ্যাঁ |

**POST Route-এর কোড ব্যাখ্যা:**
```javascript
// authMiddleware — এটা চেক করে user logged in কি না
router.post("/", authMiddleware, async (req, res) => {
  try {
    // req.body থেকে frontend-এর পাঠানো data আলাদা আলাদা variable-এ নেওয়া
    // এটাকে বলে "destructuring"
    const { month, category, propertyType, ... } = req.body;

    // Required fields আছে কি না চেক
    if (!month || !category || ...) {
      return res.status(400).json({ message: "Required fields missing" });
      // 400 = Bad Request (client-এর ভুল)
    }

    // Database-এ নতুন entry তৈরি
    const property = await Property.create({
      postedBy: req.user._id,  // logged in user-এর ID
      month, category, ...
    });

    // সফল হলে 201 (Created) status code সহ response
    return res.status(201).json({
      message: "Property posted successfully ✅",
      property,
    });
  } catch (err) {
    // কোনো অজানা error হলে 500 (Server Error) পাঠাও
    return res.status(500).json({ message: "Server error" });
  }
});
```

**DELETE Route-এর Authorization চেক:**
```javascript
// শুধু যে ব্যক্তি পোস্ট করেছে, সেই ডিলিট করতে পারবে
if (property.postedBy.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: "Not authorized" });
  // 403 = Forbidden — "তোমার এখানে অধিকার নেই"
}
```

> [!TIP]
> **ভাইভায় বলবে:** "আমরা RESTful API ব্যবহার করেছি। REST-এ POST দিয়ে তৈরি, GET দিয়ে দেখা এবং DELETE দিয়ে মুছে ফেলা হয়। `authMiddleware` দিয়ে নিশ্চিত করা হয় যে শুধু logged-in user-ই POST বা DELETE করতে পারবে।"

---

### ✅ কাজ ৪: Order Routes তৈরি (`server/routes/orderRoutes.js`)

Property Routes-এর মতোই, কিন্তু একটু ভিন্ন validation আছে:
```javascript
// Terms & Conditions agree না করলে order হবে না
if (!agreedToTerms) {
  return res.status(400).json({ message: "You must agree to Terms & Conditions" });
}
```

---

### ✅ কাজ ৫: সার্ভার কনফিগারেশন (`server/index.js`)

**৩টি গুরুত্বপূর্ণ পরিবর্তন:**

**পরিবর্তন ১ — DNS Fix (সবচেয়ে কঠিন সমস্যার সমাধান):**
```javascript
import dns from "dns";
dns.setServers(['8.8.8.8', '8.8.4.4']);
```
**কেন?** বাংলাদেশের কিছু ISP (যেমন BTCL, Grameenphone) MongoDB Atlas-এর DNS resolve করতে পারে না। Google-এর DNS (8.8.8.8) সেট করে এই সমস্যার সমাধান করা হয়েছে।

**পরিবর্তন ২ — IPv4 Force:**
```javascript
mongoose.connect(process.env.MONGO_URI, { family: 4 })
```
**কেন?** কিছু নেটওয়ার্কে IPv6 কাজ করে না, তাই `family: 4` দিয়ে বলে দেওয়া হচ্ছে "শুধু IPv4 ব্যবহার করো"।

**পরিবর্তন ৩ — নতুন Routes Register:**
```javascript
app.use("/api/properties", propertyRoutes); // Property routes
app.use("/api/orders", orderRoutes);         // Order routes
```
**কেন?** নতুন routes তৈরি করলেই হবে না, সেগুলো `index.js`-এ (main server file) রেজিস্টার করতে হয়, তা না হলে সার্ভার জানবেই না এই route আছে।

> [!TIP]
> **ভাইভায় বলবে:** "Express.js-এ `app.use()` দিয়ে middleware এবং route register করা হয়। `/api/properties` মানে হলো `http://localhost:5000/api/properties` — এই URL-এ কোনো request আসলে propertyRoutes ফাইলের কোড চলবে।"

---

### ✅ কাজ ৬: AddProperty.jsx — ফ্রন্টএন্ড ইন্টিগ্রেশন

**আগে কী ছিল?** শুধু সুন্দর দেখতে HTML form ছিল, কিন্তু Create বাটনে ক্লিক করলে কিছুই হতো না।

**এখন কী আছে?** ফর্ম পূরণ করে Create বাটনে ক্লিক করলে ডাটা সরাসরি MongoDB-তে সেভ হয়!

**যা যোগ করা হয়েছে:**

**১. useState — ডাটা ট্র্যাক করা:**
```javascript
const [form, setForm] = useState({
  month: "", category: "", propertyType: "", ...
});
```
**ব্যাখ্যা:** `useState` হলো React-এর একটা Hook। এটা ফর্মের সব ফিল্ডের ডাটা "মনে রাখে"। যখন ইউজার কিছু টাইপ করে বা সিলেক্ট করে, তখন `setForm` দিয়ে ডাটা আপডেট হয়।

**২. handleChange — ইউজারের ইনপুট ধরা:**
```javascript
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setForm((prev) => ({
    ...prev,                                           // আগের সব ডাটা রাখো
    [name]: type === "checkbox" ? checked : value,     // শুধু changed ফিল্ড আপডেট করো
  }));
};
```
**ব্যাখ্যা:** প্রতিটা `<input>` বা `<select>`-এ `name` attribute আছে। যখন ইউজার কিছু পরিবর্তন করে, `handleChange` সেই name অনুযায়ী `form` state আপডেট করে। `...prev` মানে "আগের সব ডাটা যেমন আছে রাখো, শুধু এই একটা ফিল্ড বদলাও"।

**৩. handleSubmit — API কল করা:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();        // ফর্ম সাবমিটে পেজ রিলোড হওয়া বন্ধ
  setLoading(true);           // বাটনে "Posting..." দেখাও

  const res = await fetch("http://localhost:5000/api/properties", {
    method: "POST",                                    // নতুন entry তৈরি
    headers: { "Content-Type": "application/json" },   // JSON ফরম্যাটে পাঠাচ্ছি
    credentials: "include",                            // Cookie পাঠাও (auth-এর জন্য)
    body: JSON.stringify({ ...form, price: Number(form.price) }),
  });
};
```
**ব্যাখ্যা:**
- `fetch()` = ব্রাউজার থেকে সার্ভারে HTTP Request পাঠানোর বিল্ট-ইন ফাংশন
- `method: "POST"` = নতুন ডাটা তৈরি করতে চাই
- `credentials: "include"` = Cookie পাঠাও যাতে সার্ভার বুঝতে পারে কে request করছে
- `JSON.stringify()` = JavaScript Object-কে JSON string-এ রূপান্তর করে

**৪. Conditional Rendering — Bachelor-এর জন্য Extra Option:**
```javascript
{form.category === "Bachelor" && (
  <>
    <div className="switch-row">
      <input type="checkbox" name="includesServant" ... />
      Servant charge
    </div>
    <div className="switch-row">
      <input type="checkbox" name="includesNet" ... />
      Net (Internet) bill
    </div>
  </>
)}
```
**ব্যাখ্যা:** `&&` operator দিয়ে conditional rendering করা হয়েছে। মানে, `form.category` যদি `"Bachelor"` হয় তাহলে এই দুইটা extra checkbox দেখাবে, অন্যথায় দেখাবে না।

> [!TIP]
> **ভাইভায় বলবে:** "React-এ `useState` দিয়ে form state manage করেছি। `fetch` API দিয়ে backend-এ POST request পাঠিয়েছি। `credentials: 'include'` ব্যবহার করেছি কারণ আমাদের authentication cookie-based, তাই cookie server-এ পাঠাতে হয়।"

---

### ✅ কাজ ৭: OrderHome.jsx — ফ্রন্টএন্ড ইন্টিগ্রেশন

AddProperty-র মতোই, কিন্তু একটা বিশেষ বৈশিষ্ট্য আছে — **Dynamic Location Array:**

```javascript
// একাধিক location সাপোর্ট করার জন্য Array of Objects
const [locations, setLocations] = useState([
  { division: "", district: "", area: "" }
]);

// "Add More Location" বাটনে ক্লিক করলে নতুন খালি location যোগ হয়
const addMoreLocation = () => {
  setLocations((prev) => [...prev, { division: "", district: "", area: "" }]);
};

// নির্দিষ্ট index-এর location আপডেট করা
const handleLocationChange = (index, e) => {
  const { name, value } = e.target;
  setLocations((prev) =>
    prev.map((loc, i) => (i === index ? { ...loc, [name]: value } : loc))
  );
};
```
**ব্যাখ্যা:** `locations` হলো একটা Array। প্রতিটা element একটা Object `{ division, district, area }`। `map()` দিয়ে Array-র প্রতিটা element-এর জন্য একটা করে Location Card render হয়।

> [!TIP]
> **ভাইভায় বলবে:** "Array of Objects ব্যবহার করে dynamic form field তৈরি করেছি। ইউজার যতবার 'Add More Location' চাপবে, ততটা নতুন location card আসবে। `.map()` method দিয়ে Array loop করে প্রতিটা element render করা হয়েছে।"

---

## 🧪 অংশ ২: ডাটা ফ্লো — ফর্ম সাবমিট থেকে ডাটাবেস পর্যন্ত

```
┌─────────────────┐    fetch("POST")     ┌────────────────┐   mongoose.create()   ┌──────────┐
│   React Form    │ ──────────────────▶ │  Express Route  │ ──────────────────▶ │  MongoDB  │
│  (AddProperty)  │   JSON data +       │ (/api/properties│   Property Schema    │ (Atlas)  │
│                 │   Cookie             │  + authCheck)   │   অনুযায়ী validate    │          │
└─────────────────┘                      └────────────────┘                      └──────────┘
        ◀────────────────────────────────────────────────────────────────────────────
                              Response: { message, property }
```

**ধাপে ধাপে:**
1. ইউজার ফর্ম পূরণ করে **Create** বাটনে ক্লিক করে
2. `handleSubmit` ফাংশন চলে → `fetch()` দিয়ে ডাটা JSON হিসেবে সার্ভারে পাঠায়
3. Express সার্ভার (`/api/properties`) request গ্রহণ করে
4. `authMiddleware` চেক করে ইউজার logged in কি না (Cookie থেকে JWT verify করে)
5. Route handler `req.body` থেকে ডাটা বের করে, required fields validate করে
6. `Property.create()` দিয়ে MongoDB-তে নতুন document তৈরি হয়
7. সফল হলে `201 Created` status সহ response যায়, ফ্রন্টএন্ডে ✅ মেসেজ দেখায়

---

## 📝 অংশ ৩: ভাইভা প্রশ্ন ও উত্তর

### প্রশ্ন ১: "Mongoose Schema কী? কেন ব্যবহার করলে?"
**উত্তর:** "Mongoose Schema হলো MongoDB-র জন্য একটা কাঠামো (Structure), যেটা বলে দেয় কোন ফিল্ডে কী ধরনের ডাটা ঢুকবে (String, Number, Boolean ইত্যাদি)। এটা ব্যবহার করেছি কারণ MongoDB নিজে থেকে কোনো structure enforce করে না (schema-less), কিন্তু real-world app-এ আমাদের ডাটার structure দরকার। যেমন — price ফিল্ডে যদি কেউ text দেয়, Mongoose সেটা reject করে দেবে।"

### প্রশ্ন ২: "REST API মানে কী? তুমি কোন কোন HTTP Method ব্যবহার করেছ?"
**উত্তর:** "REST হলো একটা API Design Pattern। এখানে প্রতিটা URL একটা resource represent করে (যেমন `/api/properties`)। আমি ৩টা HTTP Method ব্যবহার করেছি:
- **POST** → নতুন property/order তৈরি করা (Create)
- **GET** → property/order দেখা (Read)
- **DELETE** → নিজের property/order মুছে ফেলা (Delete)"

### প্রশ্ন ৩: "Authentication কীভাবে কাজ করছে?"
**উত্তর:** "Cookie-based JWT Authentication ব্যবহার করা হয়েছে। Login-এর সময় সার্ভার একটা JWT token তৈরি করে Cookie-তে সেট করে দেয়। পরবর্তী প্রতিটা request-এ ব্রাউজার এই Cookie automatically পাঠায়। আমাদের `authMiddleware` এই Cookie থেকে JWT বের করে verify করে, এবং `req.user`-এ logged-in user-এর তথ্য সেট করে দেয়।"

### প্রশ্ন ৪: "useState কী? কেন ব্যবহার করলে?"
**উত্তর:** "useState হলো React-এর একটা Hook যেটা Component-এর মধ্যে ডাটা (state) store এবং update করতে দেয়। আমি `useState` ব্যবহার করেছি form-এর input value গুলো track করতে। যখন ইউজার কিছু টাইপ করে, `setForm` দিয়ে state আপডেট হয়, এবং React automatically UI re-render করে।"

### প্রশ্ন ৫: "fetch() এবং credentials: 'include' কেন দিলে?"
**উত্তর:** "fetch() হলো browser-এর built-in function, HTTP request পাঠানোর জন্য। `credentials: 'include'` দিয়েছি কারণ আমাদের backend Cookie-based authentication ব্যবহার করে। Default-এ fetch() cross-origin request-এ Cookie পাঠায় না। `include` বলে দেয় 'Cookie-সহ request পাঠাও', না হলে server বুঝতে পারবে না কে request করছে।"

### প্রশ্ন ৬: "populate() কী?"
**উত্তর:** "MongoDB-তে `postedBy` ফিল্ডে শুধু user-এর ObjectId (একটা random string) সেভ হয়। কিন্তু API response-এ আমরা user-এর নাম ও ফোন নম্বর দেখাতে চাই। `.populate('postedBy', 'name phone')` — এটা ওই ObjectId ব্যবহার করে User collection থেকে ওই user-এর name আর phone নিয়ে আসে। এটাকে SQL-এর JOIN-এর সাথে তুলনা করা যায়।"

### প্রশ্ন ৭: "DNS Error কেন এসেছিল? কীভাবে সমাধান করলে?"
**উত্তর:** "বাংলাদেশের কিছু ISP (Internet Service Provider) MongoDB Atlas-এর ডোমেইন (mongodb.net) ঠিকমতো resolve করতে পারে না। এটা একটা DNS সমস্যা। সমাধান হিসেবে আমি Node.js-এর `dns` module দিয়ে Google-এর Public DNS (8.8.8.8) সেট করেছি, যাতে ISP-এর DNS বাইপাস হয়।"

### প্রশ্ন ৮: "`e.preventDefault()` কেন দিলে?"
**উত্তর:** "HTML ফর্ম সাবমিট করলে by default পুরো পেজ রিলোড হয়ে যায়। কিন্তু আমরা React-এ Single Page Application (SPA) বানাচ্ছি, তাই পেজ রিলোড চাই না। `e.preventDefault()` এই default ব্যবহার বন্ধ করে দেয়, এবং আমরা নিজেরা fetch() দিয়ে ডাটা পাঠাই।"

### প্রশ্ন ৯: "Status Code 201, 400, 403, 500 — এগুলো কী?"
**উত্তর:**
- **201** = Created → নতুন resource সফলভাবে তৈরি হয়েছে
- **400** = Bad Request → Client ভুল ডাটা পাঠিয়েছে (required field missing ইত্যাদি)
- **403** = Forbidden → User-এর এই কাজ করার অনুমতি নেই (অন্যের post delete করতে চেষ্টা)
- **500** = Internal Server Error → সার্ভারে অপ্রত্যাশিত সমস্যা হয়েছে

### প্রশ্ন ১০: "Conditional Rendering কীভাবে করেছ?"
**উত্তর:** "React-এ `&&` operator দিয়ে conditional rendering করা হয়। যেমন `{form.category === "Bachelor" && (<div>...</div>)}` — এটার মানে যদি category 'Bachelor' হয় তাহলে ওই div দেখাও, না হলে দেখাওয়া না। এইভাবে আমি Bachelor সিলেক্ট করলে extra options (Servant charge, Net bill) dynamically দেখিয়েছি।"

---

## 🔑 অংশ ৪: Key Concepts Cheat Sheet

| Term | বাংলায় ব্যাখ্যা |
|---|---|
| **MongoDB** | NoSQL Database — JSON-like document-এ ডাটা রাখে |
| **Mongoose** | MongoDB-র জন্য Node.js library — Schema, Validation, Query সব সহজ করে |
| **Schema** | ডাটাবেসের ছক — কোন ফিল্ডে কী type-এর ডাটা ঢুকবে |
| **Express.js** | Node.js-এর web framework — API বানানোর জন্য |
| **Router** | Express-এর routing system — কোন URL-এ কী হবে তা নির্ধারণ |
| **Middleware** | Request আসার পরে, route handler-এর আগে চলে (auth check ইত্যাদি) |
| **REST API** | API design pattern — POST/GET/PUT/DELETE method ব্যবহার করে |
| **useState** | React Hook — component-এর ভেতরে ডাটা (state) ধরে রাখতে |
| **fetch()** | Browser-এর built-in function — HTTP request পাঠানোর জন্য |
| **JWT** | JSON Web Token — authentication-এর জন্য encrypted token |
| **CORS** | Cross-Origin Resource Sharing — ভিন্ন port/domain থেকে API call allow করা |
| **ObjectId** | MongoDB-র unique identifier — প্রতিটা document-এর নিজস্ব ID |
| **populate()** | ObjectId reference ধরে অন্য collection থেকে full data আনা |

---

> [!IMPORTANT]
> **মনে রাখো:** তুমি মোট **৪টি নতুন ফাইল তৈরি** করেছো (Property Model, Order Model, Property Routes, Order Routes) এবং **৩টি ফাইল মডিফাই** করেছো (index.js, AddProperty.jsx, OrderHome.jsx)। কারো কোনো ডিজাইন বা CSS পরিবর্তন হয়নি।
