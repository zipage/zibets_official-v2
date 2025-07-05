import { useState, useEffect } from "react";
import { db, auth } from "../util/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import ZibetsCurrency from "../components/ZibetsCurrency";

const AddBet = () => {
  const [formData, setFormData] = useState({
    date: "",
    event: "",
    betType: "Moneyline",
    odds: "",
    stake: "",
    outcome: "Pending",
  });

  const [oddsFormat, setOddsFormat] = useState("American");
  const [user, setUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.log("❌ User not logged in.");
      return;
    }

    try {
      await addDoc(collection(db, "bets"), {
        ...formData,
        userId: user.uid,
        odds: parseFloat(formData.odds),
        stake: parseFloat(formData.stake),
        oddsFormat: oddsFormat,
        createdAt: serverTimestamp(),
      });

      setFormData({
        date: "",
        event: "",
        betType: "Moneyline",
        odds: "",
        stake: "",
        outcome: "Pending",
      });
      setOddsFormat("American");

      setSuccessMsg("✅ Bet saved!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("🔥 Firestore ERROR:", err);
      setSuccessMsg("❌ Failed to save bet.");
    }
  };

  const calculateWinnings = (odds, stake) => {
    if (oddsFormat === "Fractional") {
      const [numerator, denominator] = odds.toString().split("/").map(Number);
      if (!denominator || isNaN(numerator)) return 0;
      return ((numerator / denominator) * stake).toFixed(2);
    }

    const numericOdds = parseFloat(odds);
    if (isNaN(numericOdds) || isNaN(stake)) return 0;

    if (oddsFormat === "Decimal") {
      return ((numericOdds - 1) * stake).toFixed(2);
    }

    if (numericOdds > 0) {
      return ((numericOdds / 100) * stake).toFixed(2);
    } else {
      return ((100 / Math.abs(numericOdds)) * stake).toFixed(2);
    }
  };

  const calculateTotalReturn = (odds, stake) => {
    const winnings = parseFloat(calculateWinnings(odds, stake));
    const total = parseFloat(stake) + winnings;
    return total.toFixed(2);
  };

  return (
    <div>
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

            <select
              name="oddsFormat"
              value={oddsFormat}
              onChange={(e) => setOddsFormat(e.target.value)}
              className="input"
            >
              <option value="American">🇺🇸 American</option>
              <option value="Decimal">🇪🇺 Decimal</option>
              <option value="Fractional">🇬🇧 Fractional</option>
            </select>

            <div className="col-span-2">
              <input
                type="text"
                name="odds"
                placeholder="Odds (e.g. -110, 2.5, or 5/2)"
                value={formData.odds}
                onChange={handleChange}
                className="input w-full"
                required
              />
              {formData.betType === "Parlay" && (
                <div className="text-sm text-gray-600 mt-1 italic space-y-1">
                  <p>
                    💡 For Parlay bets, enter the <span className="font-semibold">combined odds</span> manually. (Multiply all leg odds together using <span className="underline">decimal format</span>.)
                  </p>
                  <p>
                    🧮 Need help?{" "}
                    <Link
                      to="/parlay-calculator"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Use the Parlay Calculator
                    </Link>
                  </p>
                </div>
              )}
            </div>

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
            You’re betting <ZibetsCurrency amount={formData.stake || 0} /> to win{" "}
            <ZibetsCurrency
              amount={
                formData.stake && formData.odds
                  ? calculateWinnings(formData.odds, formData.stake)
                  : 0
              }
            />
            .<br />
            You’ll get{" "}
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
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        {successMsg && (
          <div className="bg-green-100 text-green-800 border border-green-300 rounded px-4 py-3 shadow">
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBet;
