// src/components/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../util/firebase";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Username = Display Name
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Set displayName on the Firebase Auth user
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // ✅ Optional: reload to ensure latest info
      await userCredential.user.reload();

      // ✅ Save to Firestore (already perfect)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        username: username,
        createdAt: new Date(),
      });

      navigate("/dashboard");
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
        <h3 className="text-xl font-semibold mb-6">Sign up</h3>

        <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            Sign up
          </button>
        </form>

        <p className="mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
