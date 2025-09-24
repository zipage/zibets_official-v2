// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../util/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import toast from "react-hot-toast";

function Dashboard({ user }) {
  const [bets, setBets] = useState([]);
  const [stats, setStats] = useState({
    totalBets: 0,
    roi: 0,
    zibets: 0,
  });

  const location = useLocation();

  const convertOddsToDecimal = (odds) => {
    const num = parseFloat(odds);
    if (isNaN(num)) return 1;
    if (num > 0) {
      return 1 + num / 100;
    } else {
      return 1 + 100 / Math.abs(num);
    }
  };

  const handleOutcomeChange = async (betId, newOutcome) => {
    try {
      const betRef = doc(db, "bets", betId);
      await updateDoc(betRef, { outcome: newOutcome });

      setBets((prevBets) =>
        prevBets.map((bet) =>
          bet.id === betId ? { ...bet, outcome: newOutcome } : bet
        )
      );

      toast.success(`Updated outcome to "${newOutcome}"`);
    } catch (err) {
      console.error("❌ Error updating outcome:", err);
      toast.error("Error updating outcome.");
    }
  };

  const handleDeleteBet = async (betId) => {
    try {
      await deleteDoc(doc(db, "bets", betId));
      setBets((prevBets) => prevBets.filter((bet) => bet.id !== betId));
      toast("🗑️ Bet deleted successfully!", {
        icon: "✅",
        style: {
          borderRadius: "8px",
          background: "#fefefe",
          color: "#333",
          fontWeight: "500",
        },
      });
    } catch (err) {
      console.error("❌ Error deleting bet:", err);
      toast.error("Failed to delete bet.");
    }
  };

  useEffect(() => {
    const fetchBets = async () => {
      const q = query(collection(db, "bets"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userBets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBets(userBets);

      const totalBets = userBets.length;
      let totalStake = 0;
      let totalProfit = 0;

      userBets.forEach((bet) => {
        const stake = parseFloat(bet.stake) || 0;
        const odds = convertOddsToDecimal(bet.odds);
        const outcome = bet.outcome?.toLowerCase();

        if (outcome === "won") {
          const winnings = stake * (odds - 1);
          totalProfit += winnings;
          totalStake += stake;
        } else if (outcome === "lost") {
          totalProfit -= stake;
          totalStake += stake;
        }
      });

      const roi = totalStake > 0 ? ((totalProfit / totalStake) * 100).toFixed(1) : 0;
      const startingZibets = 5000;

      setStats({
        totalBets,
        roi,
        zibets: (startingZibets + parseFloat(totalProfit)).toFixed(2),
      });
    };

    if (user?.uid) {
      fetchBets();
    }
  }, [user, location.pathname]);

  const sortedBets = [...bets].sort((a, b) => {
    if (a.outcome === "Pending" && b.outcome !== "Pending") return -1;
    if (a.outcome !== "Pending" && b.outcome === "Pending") return 1;
    return 0;
  });

  return (
    <div>
      {user && (
        <h1 className="text-2xl font-semibold mb-4 text-blue-900">
          Welcome back, {user.displayName || user.email}!
        </h1>
      )}

      <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded mb-6 font-medium border border-blue-200">
        <strong>Paper Betting:</strong> No real money was harmed by the making of these bets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded p-6 text-center border border-blue-100">
          <div className="text-3xl font-bold text-blue-700">{stats.totalBets}</div>
          <div className="text-sm text-gray-500 mt-2">Total Bets</div>
        </div>

        <div className="bg-white shadow rounded p-6 text-center border border-blue-100">
          <div className="text-3xl font-bold text-green-600">{stats.roi}%</div>
          <div className="text-sm text-gray-500 mt-2">ROI %</div>
        </div>

        <div className="bg-white shadow rounded p-6 text-center border border-blue-100">
          <div className="text-3xl font-bold text-blue-600">{stats.zibets}</div>
          <div className="text-sm text-gray-500 mt-2">ZiBets</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-blue-800 mb-2">Recent Bets</h2>
      <div className="overflow-x-auto bg-white rounded shadow border border-blue-100">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-900 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Stake</th>
              <th className="px-4 py-3">Odds</th>
              <th className="px-4 py-3">Outcome</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBets.length > 0 ? (
              sortedBets.map((bet) => (
                <tr key={bet.id} className="border-t">
                  <td className="px-4 py-2">{bet.date}</td>
                  <td className="px-4 py-2">{bet.event}</td>
                  <td className="px-4 py-2">{bet.betType}</td>
                  <td className="px-4 py-2">𝓏{bet.stake}</td>
                  <td className="px-4 py-2">{bet.odds}</td>
                  <td className="px-4 py-2">
                    {bet.outcome === "Pending" ? (
                      <select
                        value={bet.outcome}
                        onChange={(e) =>
                          handleOutcomeChange(bet.id, e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    ) : (
                      bet.outcome
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteBet(bet.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-4 text-gray-500 italic text-center"
                >
                  No bets yet. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
