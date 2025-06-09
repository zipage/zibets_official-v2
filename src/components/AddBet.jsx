import { useState, useEffect } from "react";
import { db, auth } from "../util/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ZibetsCurrency from "../components/ZibetsCurrency";
import SidebarLayout from "./SidebarLayout";

const AddBet = () => {
  const [formData, setFormData] = useState({
    date: "",
    event: "",
    betType: "Moneyline",
    odds: "",
    stake: "",
    outcome: "Pending",
  });

  const [user, setUser] = useState(null);
  const [recentBets, setRecentBets] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("✅ Logged in as:", currentUser?.uid);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecentBets = async () => {
      if (!user) return;
      const q = query(
        collection(db, "users", user.uid, "bets"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const bets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecentBets(bets);
    };

    fetchRecentBets();
  }, [user, formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to save your bet.");
      console.log("❌ No user found, stopping submission");
      return;
    }

    try {
      console.log("📝 Submitting bet:", formData, "For user:", user.uid);

      await addDoc(collection(db, "users", user.uid, "bets"), {
        ...formData,
        odds: parseFloat(formData.odds),
        stake: parseFloat(formData.stake),
        createdAt: serverTimestamp(),
      });

      console.log("✅ Bet added to Firestore!");
      alert("Bet added!");
      setFormData({
        date: "",
        event: "",
        betType: "Moneyline",
        odds: "",
        stake: "",
        outcome: "Pending",
      });
    } catch (err) {
      console.error("🔥 Firestore ERROR:", err);
      alert("Failed to save bet.");
    }
  };

  const calculateWinnings = (odds, stake) => {
    let payout = 0;
    const numericOdds = parseFloat(odds);
    if (isNaN(numericOdds) || isNaN(stake)) return 0;

    if (numericOdds > 0) {
      payout = (numericOdds / 100) * stake;
    } else {
      payout = (100 / Math.abs(numericOdds)) * stake;
    }

    return payout.toFixed(2);
  };

  const calculateTotalReturn = (odds, stake) => {
    const winnings = parseFloat(calculateWinnings(odds, stake));
    const total = parseFloat(stake) + winnings;
    return total.toFixed(2);
  };

  return (
    <SidebarLayout>
      <h1 className="text-2xl font-bold mb-6">Add Bet</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 shadow-md w-full lg:w-2/3"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="event"
              placeholder="Event"
              value={formData.event}
              onChange={handleChange}
              className="input"
              required
            />
            <select
              name="betType"
              value={formData.betType}
              onChange={handleChange}
              className="input"
            >
              <option>Moneyline</option>
              <option>Spread</option>
              <option>Over/Under</option>
              <option>Parlay</option>
            </select>
            <input
              type="text"
              name="odds"
              placeholder="Odds (e.g. -110 or 2.5)"
              value={formData.odds}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="number"
              name="stake"
              placeholder="Stake (Z10)"
              value={formData.stake}
              onChange={handleChange}
              className="input"
              required
            />
            <select
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              className="input"
            >
              <option>Pending</option>
              <option>Won</option>
              <option>Lost</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Bet
          </button>
        </form>

        <div className="bg-white rounded-lg p-6 shadow-md w-full lg:w-1/3">
          <p className="text-gray-700 text-lg">
            You’re betting <ZibetsCurrency amount={formData.stake || 0} /> to
            win {" "}
            <ZibetsCurrency
              amount={
                formData.stake && formData.odds
                  ? calculateWinnings(formData.odds, formData.stake)
                  : 0
              }
            />
            .
            <br />
            You’ll get {" "}
            <ZibetsCurrency
              amount={
                formData.stake && formData.odds
                  ? calculateTotalReturn(formData.odds, formData.stake)
                  : 0
              }
            />{" "}
            back if your bet wins.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Bets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Odds</th>
                <th className="px-4 py-2 text-left">Stake</th>
                <th className="px-4 py-2 text-left">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {recentBets.map((bet) => (
                <tr key={bet.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{bet.date}</td>
                  <td className="px-4 py-2 text-sm">{bet.event}</td>
                  <td className="px-4 py-2 text-sm">{bet.odds}</td>
                  <td className="px-4 py-2 text-sm">Z{bet.stake}</td>
                  <td className="px-4 py-2 text-sm">{bet.outcome}</td>
                </tr>
              ))}
              {recentBets.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                    No recent bets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AddBet;
