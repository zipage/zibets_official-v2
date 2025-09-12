// src/components/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../util/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-black font-sans overflow-hidden">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Zibets</h1>
        <div className="space-x-4 text-sm font-medium">
          {user ? (
            <>
              <span className="text-green-700">Welcome, {user.displayName || user.email} ✅</span>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button
                onClick={() => signOut(auth)}
                className="hover:underline text-red-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link
                to="/signup"
                className="bg-black text-white px-4 py-1.5 border border-black hover:bg-white hover:text-black transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center px-6 py-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Track your sports bets — without risking a cent.</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">Zibets is a paper betting + tracker built for casual bettors who love the game, not the gamble. From the NHL and NBA to the NFL and MLB, Zibets lets you enjoy paper betting on the games you love most.</p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 font-medium hover:bg-blue-700 transition">Get Started</Link>
          <Link to="/login" className="border border-black px-6 py-2 font-medium hover:bg-gray-100 transition">Log In</Link>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="bg-white px-6 py-12">
        <h3 className="text-center text-2xl font-bold mb-10">How does it work?</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <h4 className="text-lg font-semibold mb-2">What is paper betting?</h4>
            <p className="text-gray-600">Place your bets with fake money, get real excitement, and have zero regrets. It’s like sports betting — minus the financial heartbreak.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Can I export my data?</h4>
            <p className="text-gray-600">Absolutely! You can export your betting history anytime to analyze your performance.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Why paper betting instead of real money?</h4>
            <p className="text-gray-600">We believe in the excitement of betting without the financial loss. Your adrenaline stays, but your bank account stays safe.</p>
          </div>
        </div>
      </section>

      {/* Quote + Footer */}
      <footer className="text-center text-sm text-gray-500 px-4 pb-4">
        <p className="italic">No real money was harmed by the making of these bets.</p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-400">
          <span className="hover:underline cursor-pointer">FAQ</span>
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hover:underline cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
