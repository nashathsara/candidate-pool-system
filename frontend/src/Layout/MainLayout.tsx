import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  FiHome,
  FiUsers,
  FiCopy,
  FiSettings,
  FiSearch,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
    navigate("/", { replace: true });
  };

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome className="w-5 h-5" /> },
    { name: "Candidates", path: "/candidates", icon: <FiUsers className="w-5 h-5" /> },
    { name: "Duplicates", path: "/duplicates-admin", icon: <FiCopy className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <FiSettings className="w-5 h-5" /> },
  ];

  const showLeftPill = !location.pathname.startsWith("/browse");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-gray-900 p-6 fixed h-screen overflow-y-auto border-r border-gray-100">
        <div className="logo-section mb-10">
          <h1 className="text-xl font-bold mb-1 text-gray-900">
            Candidate<span className="text-blue-500">Hub</span>
          </h1>
          <p className="text-xs text-gray-400">Global Talent Pool</p>
        </div>

        <nav className="flex flex-col gap-1 mb-8">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-6 left-6 right-6">
          {showLeftPill && (
            <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-md bg-gray-700 cursor-pointer transition-all duration-200 text-white hover:bg-gray-800 hover:text-gray-100">
              <FiSearch className="w-5 h-5" />
              <span className="text-sm font-medium">New Search</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 text-sm transition-all duration-200"
            >
              <FiHelpCircle className="w-4 h-4" />
              Support
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 text-sm transition-all duration-200 text-left"
            >
              <FiLogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-gray-50">
        <div className="p-8">
          <div className="page-content">{children}</div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 px-8 text-center text-gray-400 text-xs border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="footer-left text-left">
              <strong className="text-gray-500">Candidate pool</strong>
              <p className="mt-1">© 2024 WHS. All rights reserved.</p>
            </div>
            <div className="footer-right flex gap-6">
              <a href="#privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#help" className="hover:text-blue-600 transition-colors">
                Help Center
              </a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
