// src/components/SidebarLayout.jsx
import { Link, Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#155EEF] text-white p-4">
        <div className="text-2xl font-bold mb-8">ZIBETS</div>
        <nav className="flex flex-col space-y-4 text-white font-semibold">
          <Link to="/home" className="hover:underline hover:text-white">
             Home
          </Link>
          <Link to="/dashboard" className="hover:underline hover:text-white">
             Dashboard
          </Link>
          <Link to="/add-bet" className="hover:underline hover:text-white">
             Add Paper Bet
          </Link>
          <Link to="/paper-trail" className="hover:underline hover:text-white">
             Paper Trail
          </Link>
          <Link to="/parlay-calculator" className="hover:underline hover:text-white">
             Parlay Calculator
          </Link>
          <Link to="/glossary" className="hover:underline hover:text-white">
             Glossary
          </Link>

          {/* Divider */}
          <hr className="my-4 border-white/30" />

          <Link to="/logout" className="hover:underline hover:text-white">
             Log Out
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
