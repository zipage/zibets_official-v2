import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddBet from "./components/AddBet"; // ✅ this line is key

function App() {
  const [user, setUser] = useState({ uid: "test123" });

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
      <Route path="/add-bet" element={<AddBet />} /> {/* ✅ This must be here */}
    </Routes>
  );
}

export default App;
