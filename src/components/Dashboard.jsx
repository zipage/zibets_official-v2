// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { db } from "../util/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import SidebarLayout from "./SidebarLayout";

function Dashboard({ user }) {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    const fetchBets = async () => {
      const q = query(collection(db, "bets"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userBets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBets(userBets);
    };

    if (user?.uid) fetchBets();
  }, [user]);

  return (
    <SidebarLayout>
      {user && (
        <h1 className="text-2xl font-semibold mb-4">
          Welcome back, {user.displayName || user.email}!
        </h1>
      )}

      <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded mb-6 font-medium">
        <strong>Paper Betting:</strong> No real money was harmed by the making of these bets.
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Bets */}
        <div className="bg-white shadow rounded p-4 text-center border">
          <div className="text-2xl font-bold">234</div>
          <div className="text-sm text-gray-500 mt-1">Total Bets</div>
        </div>

        {/* ROI */}
        <div className="bg-white shadow rounded p-4 text-center border">
          <div className="text-2xl font-bold text-green-600">16.8%</div>
          <div className="text-sm text-gray-500 mt-1">ROI %</div>
        </div>

        {/* Zibets */}
        <div className="bg-white shadow rounded p-4 text-center border">
          <div className="text-2xl font-bold text-blue-600">1,335</div>
          <div className="text-sm text-gray-500 mt-1">Zibets</div>
        </div>
      </div>
    </SidebarLayout>
  );
}

export default Dashboard;
