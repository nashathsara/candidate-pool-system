import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiCopy,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome className="h-5 w-5" /> },
    { name: "Candidates", path: "/candidates", icon: <FiUsers className="h-5 w-5" /> },
    { name: "Duplicates", path: "/duplicates", icon: <FiCopy className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <FiSettings className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-[280px] flex-col justify-between border-r border-[#c6c6cd] bg-[#f2f4f6] px-4 py-6">
        <div>
          <div className="mb-12 px-2">
            <h1 className="text-xl font-bold tracking-tight text-[#191c1e]">
              CandidateHub
            </h1>
            <p className="mt-1 text-base text-[#45464d]/70">Global Talent Pool</p>
          </div>

          <nav className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded px-4 py-3 text-base transition ${
                  location.pathname === item.path
                    ? "bg-[#d0e1fb] text-[#54647a]"
                    : "text-[#45464d] hover:bg-white/70"
                }`}
              >
                <span className="text-[#45464d]">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-[#c6c6cd] pt-5">
          <button
            className="mb-5 flex w-full items-center justify-center gap-3 rounded bg-black px-4 py-3 text-base text-white transition hover:bg-[#191c1e]"
            type="button"
          >
            <FiSearch className="h-5 w-5" />
            <span>New Search</span>
          </button>

          <div className="flex flex-col gap-2 text-[#45464d]">
            <a
              href="#support"
              className="flex items-center gap-3 rounded px-4 py-2 text-base transition hover:bg-white/70"
            >
              <FiHelpCircle className="h-5 w-5" />
              Support
            </a>
            <a
              href="#signout"
              className="flex items-center gap-3 rounded px-4 py-2 text-base transition hover:bg-white/70"
            >
              <FiLogOut className="h-5 w-5" />
              Sign Out
            </a>
          </div>
        </div>
      </aside>

      <main className="ml-[280px] min-h-screen bg-[#f7f9fb]">{children}</main>
    </div>
  );
};

export default MainLayout;
