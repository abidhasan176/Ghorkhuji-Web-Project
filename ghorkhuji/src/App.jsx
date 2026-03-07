import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccessibleHome from "./pages/AccessibleHome";
import Profile from "./pages/Profile";
import AddProperty from "./pages/AddProperty";
import OrderHome from "./pages/OrderHome";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/accessible-home" element={<AccessibleHome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/order-home" element={<OrderHome/>}/>
    </Routes>
  );
}

export default App;
