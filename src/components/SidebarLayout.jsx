import { Link } from "react-router-dom";

const SidebarLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-[#155EEF] text-white p-4">
                <div className="text-2xl font-bold mb-8">ZIBETS</div>
                <nav className="flex flex-col space-y-4 text-white font-semibold">
                    <Link to="/dashboard" className="hover:underline hover:text-white">Dashboard</Link>
                    <Link to="/add-bet" className="hover:underline hover:text-white">Add Paper Bet</Link>
                    <Link to="/track-bets" className="hover:underline hover:text-white">My Stats</Link>
                    <Link to="/glossary" className="hover:underline hover:text-white">Glossary</Link>
                    <Link to="/logout" className="hover:underline hover:text-white">Log Out</Link>
                </nav>

            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
    );
};

export default SidebarLayout;
