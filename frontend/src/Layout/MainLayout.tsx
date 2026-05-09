import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MainLayout.css";

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M4 4h7v7H4V4Zm0 9h7v7H4v-7Zm9-9h7v7h-7V4Zm0 9h7v7h-7v-7Z" fill="currentColor" />
  </svg>
);

const CandidatesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-6.5 8a6.5 6.5 0 0 1 13 0H5.5Z" fill="currentColor" />
  </svg>
);

const DuplicatesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M7 4h11a2 2 0 0 1 2 2v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 20H6a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1a.8.8 0 0 1-.6 1.4h-2a1.8 1.8 0 0 0-1.7 1.2l-.2.5a.8.8 0 0 1-1.5 0l-.2-.5a1.8 1.8 0 0 0-1.7-1.2h-2a.8.8 0 0 1-.6-1.4l.1-.1a1.8 1.8 0 0 0 .3-2l-.5-.9a.8.8 0 0 1 .2-1l1.4-1.1a1.8 1.8 0 0 0 .6-2l-.1-.2a.8.8 0 0 1 .6-1.1h2a1.8 1.8 0 0 0 1.7-1.2l.2-.5a.8.8 0 0 1 1.5 0l.2.5a1.8 1.8 0 0 0 1.7 1.2h2a.8.8 0 0 1 .6 1.4l-.1.1a1.8 1.8 0 0 0-.3 2l.5.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { name: "Candidates", path: "/candidates", icon: <CandidatesIcon /> },
    { name: "Duplicates", path: "/duplicates", icon: <DuplicatesIcon /> },
    { name: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Candidate pool</h1>
          <p>Global Talent Pool</p>
        </div>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="content">
        <div className="page-header">
          <h2>Candidate view</h2>
        </div>
        <div className="page-content">{children}</div>
        <footer className="app-footer">
          <div className="footer-left">
            <strong>Candidate pool</strong>
            <p>© 2024 WHS. All rights reserved.</p>
          </div>
          <div className="footer-right">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#help">Help Center</a>
            <a href="#contact">Contact Us</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;


