// src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./util/firebase";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddBet from "./components/AddBet";
import Glossary from "./components/Glossary";
import SidebarLayout from "./components/SidebarLayout";
import PaperTrail from "./pages/PaperTrail";
import ParlayCalculator from "./components/ParlayCalculator"; // ✅ ADD THIS

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser(auth.currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes with sidebar layout */}
      <Route path="/" element={<SidebarLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard user={user} />} />
        <Route path="add-bet" element={<AddBet user={user} />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="paper-trail" element={<PaperTrail />} />
        <Route path="parlay-calculator" element={<ParlayCalculator />} /> {/* ✅ ADD THIS */}
      </Route>
    </Routes>
  );
}

export default App;
