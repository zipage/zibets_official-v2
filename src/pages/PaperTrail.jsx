// src/components/PaperTrail.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../util/firebase";

const PaperTrail = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBets = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "bets"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      const betList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBets(betList);
    } catch (error) {
      console.error("Error fetching bets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  const downloadCSV = () => {
    const header = ["Date", "Event", "Type", "Odds", "Format", "Stake", "Outcome"];
    const rows = bets.map((bet) => [
      new Date(bet.date).toLocaleDateString(),
      bet.event,
      bet.betType,
      bet.odds,
      bet.oddsFormat || "N/A",
      bet.stake,
      bet.outcome,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows]
        .map((e) => e.map((cell) => `"${cell}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "paper_trail_zibets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📄 Paper Trail</h1>
        <button
          onClick={downloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Download CSV
        </button>
      </div>

      {loading ? (
        <p>Loading your slips...</p>
      ) : bets.length === 0 ? (
        <p>No bets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Event</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Odds</th>
                <th className="px-4 py-2 border">Format</th>
                <th className="px-4 py-2 border">Stake</th>
                <th className="px-4 py-2 border">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet) => (
                <tr key={bet.id}>
                  <td className="px-4 py-2 border">
                    {new Date(bet.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{bet.event}</td>
                  <td className="px-4 py-2 border">{bet.betType}</td>
                  <td className="px-4 py-2 border">{bet.odds}</td>
                  <td className="px-4 py-2 border">{bet.oddsFormat || "N/A"}</td>
                  <td className="px-4 py-2 border">{bet.stake}</td>
                  <td className="px-4 py-2 border">{bet.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaperTrail;
