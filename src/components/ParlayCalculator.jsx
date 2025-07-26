// src/components/ParlayCalculator.jsx
import { useState } from "react";
import ZibetsCurrency from "../components/ZibetsCurrency";

const ParlayCalculator = () => {
  const [oddsList, setOddsList] = useState([""]);
  const [stake, setStake] = useState("");
  const [combinedOdds, setCombinedOdds] = useState(0);
  const [winnings, setWinnings] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);

  const handleOddsChange = (value, index) => {
    const newOddsList = [...oddsList];
    newOddsList[index] = value;
    setOddsList(newOddsList);
  };

  const addOddsField = () => {
    setOddsList([...oddsList, ""]);
  };

  const calculateParlay = () => {
    const decimalOdds = oddsList.map(Number).filter((o) => !isNaN(o) && o > 0);
    if (decimalOdds.length === 0 || !stake) return;

    const combined = decimalOdds.reduce((acc, curr) => acc * curr, 1);
    const win = (combined - 1) * parseFloat(stake);
    const total = win + parseFloat(stake);

    setCombinedOdds(combined.toFixed(2));
    setWinnings(win.toFixed(2));
    setTotalReturn(total.toFixed(2));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧮 Parlay Calculator</h1>

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        {oddsList.map((odds, index) => (
          <input
            key={index}
            type="number"
            step="0.01"
            placeholder={`Leg ${index + 1} (decimal odds)`}
            value={odds}
            onChange={(e) => handleOddsChange(e.target.value, index)}
            className="input w-full"
          />
        ))}

        <button
          onClick={addOddsField}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ Add Another Leg
        </button>

        <input
          type="number"
          step="0.01"
          placeholder="Stake (Z10)"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          className="input w-full"
        />

        <button
          onClick={calculateParlay}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Calculate Parlay
        </button>

        {combinedOdds > 0 && (
          <div className="mt-4 space-y-2">
            <p>
              Combined Odds: <strong>{combinedOdds}</strong>
            </p>
            <p>
              Winnings: <ZibetsCurrency amount={winnings} />
            </p>
            <p>
              Total Return: <ZibetsCurrency amount={totalReturn} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParlayCalculator;
