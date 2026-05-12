import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-nav-icon-svg">
    <path d="M4 4h7v7H4V4Zm0 9h7v7H4v-7Zm9-9h7v7h-7V4Zm0 9h7v7h-7v-7Z" fill="currentColor" />
  </svg>
);

const CandidatesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-nav-icon-svg">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-6.5 8a6.5 6.5 0 0 1 13 0H5.5Z" fill="currentColor" />
  </svg>
);

const DuplicatesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-nav-icon-svg">
    <path d="M7 4h11a2 2 0 0 1 2 2v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 20H6a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-nav-icon-svg">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1a.8.8 0 0 1-.6 1.4h-2a1.8 1.8 0 0 0-1.7 1.2l-.2.5a.8.8 0 0 1-1.5 0l-.2-.5a1.8 1.8 0 0 0-1.7-1.2h-2a.8.8 0 0 1-.6-1.4l.1-.1a1.8 1.8 0 0 0 .3-2l-.5-.9a.8.8 0 0 1 .2-1l1.4-1.1a1.8 1.8 0 0 0 .6-2l-.1-.2a.8.8 0 0 1 .6-1.1h2a1.8 1.8 0 0 0 1.7-1.2l.2-.5a.8.8 0 0 1 1.5 0l.2.5a1.8 1.8 0 0 0 1.7 1.2h2a.8.8 0 0 1 .6 1.4l-.1.1a1.8 1.8 0 0 0-.3 2l.5.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchMenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-nav-icon-svg">
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-nav-icon-svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9.5 9.5a2.8 2.8 0 1 1 4.25 2.39c-.63.53-1.04 1-1.25 1.71V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="17.2" r="0.9" fill="currentColor" />
  </svg>
);

const SignOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-nav-icon-svg">
    <path d="M10 17l-1 1H5V6h4l1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 13h6V9h-6M19 9l2.5 2.5L19 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-top-icon-svg">
    <path d="M15 17h-6m3-14a3 3 0 0 0-3 3v1.28a5.5 5.5 0 0 1-2.25 4.47L6 14h12l-1.75-1.25A5.5 5.5 0 0 1 15 7.28V6a3 3 0 0 0-3-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 19a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export interface AdminLayoutProps {
  children: ReactNode;
  /** When set, shown in the top bar next to utilities (e.g. Dashboard Overview). */
  headerTitle?: string;
}

const AdminLayout = ({ children, headerTitle }: AdminLayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { name: "Candidates", path: "/candidates", icon: <CandidatesIcon /> },
    { name: "Duplicates", path: "/duplicates", icon: <DuplicatesIcon /> },
    { name: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h1 className="admin-brand-title">CandidateHub</h1>
          <p className="admin-brand-tag">Global Talent Pool</p>
        </div>

        <nav className="admin-sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${
                location.pathname === item.path ||
                (item.path === "/candidates" &&
                  location.pathname.startsWith("/candidates/"))
                  ? "active"
                  : ""
              }`}
            >
              <span className="admin-nav-ic">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/candidates" className="admin-new-search">
            <SearchMenuIcon />
            New Search
          </Link>
          <button type="button" className="admin-foot-link">
            <HelpIcon />
            Support
          </button>
          <button type="button" className="admin-foot-link">
            <SignOutIcon />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main-col">
        <header className="admin-top-bar">
          {headerTitle ? (
            <h2 className="admin-top-title">{headerTitle}</h2>
          ) : (
            <span />
          )}
          <div className="admin-top-actions">
            <button type="button" className="admin-icon-btn" aria-label="Notifications">
              <BellIcon />
            </button>
            <div className="admin-user-pill">
              <span className="admin-user-avatar" aria-hidden>
                AC
              </span>
              <span className="admin-user-name">Alex Chen</span>
            </div>
          </div>
        </header>

        <div className="admin-page-scroll">{children}</div>

        <footer className="admin-shell-footer">
          <div className="admin-shell-footer-left">
            <strong>CandidateHub</strong>
            <span>© 2024 WHS System. All rights reserved.</span>
          </div>
          <div className="admin-shell-footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#help">Help Center</a>
            <a href="#contact">Contact Us</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
