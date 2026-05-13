import { useEffect, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "./CandidatePublicLayout.css";

const SETTINGS_STORAGE_KEY = "candidate-hub:profile-settings";
const PROFILE_SETTINGS_UPDATED_EVENT = "candidate-hub:profile-settings-updated";

type StoredProfileSettings = {
  fullName?: string;
  profilePhoto?: string;
};

const readStoredProfile = (): StoredProfileSettings => {
  try {
    const rawValue = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
};

const getInitials = (name = "Alex Jordan") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CH";

const BellIco = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
    <path d="M15 17h-6m3-14a3 3 0 0 0-3 3v1.28a5.5 5.5 0 0 1-2.25 4.47L6 14h12l-1.75-1.25A5.5 5.5 0 0 1 15 7.28V6a3 3 0 0 0-3-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 19a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const GearIco = () => (
  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1a.8.8 0 0 1-.6 1.4h-2a1.8 1.8 0 0 0-1.7 1.2l-.2.5a.8.8 0 0 1-1.5 0l-.2-.5a1.8 1.8 0 0 0-1.7-1.2h-2a.8.8 0 0 1-.6-1.4l.1-.1a1.8 1.8 0 0 0 .3-2l-.5-.9a.8.8 0 0 1 .2-1l1.4-1.1a1.8 1.8 0 0 0 .6-2l-.1-.2a.8.8 0 0 1 .6-1.1h2a1.8 1.8 0 0 0 1.7-1.2l.2-.5a.8.8 0 0 1 1.5 0l.2.5a1.8 1.8 0 0 0 1.7 1.2h2a.8.8 0 0 1 .6 1.4l-.1.1a1.8 1.8 0 0 0-.3 2l.5.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface CandidatePublicLayoutProps {
  children: ReactNode;
}

const CandidatePublicLayout = ({ children }: CandidatePublicLayoutProps) => {
  const [profileSettings, setProfileSettings] = useState<StoredProfileSettings>(() => readStoredProfile());

  useEffect(() => {
    const handleProfileUpdate = () => setProfileSettings(readStoredProfile());
    window.addEventListener(PROFILE_SETTINGS_UPDATED_EVENT, handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener(PROFILE_SETTINGS_UPDATED_EVENT, handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  const initials = getInitials(profileSettings.fullName);

  return (
    <div className="cpl-root">
      <header className="cpl-header">
        <div className="cpl-header-inner">
          <NavLink to="/profile/create" className="cpl-logo">
            CandidateHub
          </NavLink>
          <nav className="cpl-nav">
            <span className="cpl-nav-link cpl-nav-disabled">Browse Jobs</span>
            <span className="cpl-nav-link cpl-nav-disabled">Applications</span>
            <NavLink
              to="/profile/settings"
              className={({ isActive }) =>
                `cpl-nav-link${isActive ? " cpl-nav-active" : ""}`
              }
            >
              Profile &amp; Settings
            </NavLink>
            <NavLink
              to="/profile/create"
              className={({ isActive }) =>
                `cpl-nav-link${isActive ? " cpl-nav-active" : ""}`
              }
            >
              Create profile
            </NavLink>
          </nav>
          <div className="cpl-header-tools">
            <button type="button" className="cpl-icon-btn" aria-label="Notifications">
              <BellIco />
            </button>
            <button type="button" className="cpl-icon-btn" aria-label="Settings">
              <GearIco />
            </button>
            {profileSettings.profilePhoto ? (
              <img src={profileSettings.profilePhoto} alt="" className="cpl-mini-avatar cpl-mini-avatar-img" />
            ) : (
              <span className="cpl-mini-avatar" aria-hidden>
                {initials}
              </span>
            )}
          </div>
        </div>
      </header>
      <main className="cpl-main">{children}</main>
      <footer className="cpl-footer">
        <div className="cpl-footer-inner">
          <div>
            <strong>CandidateHub</strong>
            <span className="cpl-footer-copy">
              {" "}
              © 2024 WHS System. All rights reserved.
            </span>
          </div>
          <div className="cpl-footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#help">Help Center</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CandidatePublicLayout;
