import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../util/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // change if needed
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900 font-sans">
      {/* Left Panel */}
      <div className="w-1/2 bg-blue-600 text-white flex items-center justify-center px-10">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight max-w-sm">
          No real money was harmed by the making of these bets.
        </h1>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col items-center justify-center px-10 py-12 bg-white">
        <h2 className="text-3xl font-bold mb-2">Zibets</h2>
        <h3 className="text-xl font-semibold mb-6">Log in</h3>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
