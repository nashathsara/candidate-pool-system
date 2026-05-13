import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, FileText, HelpCircle, Bell, Search, BarChart3, LogOut } from 'lucide-react';
import './CandidateSettingsPage.css';

const CandidateSettingsPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  const handleSignOut = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/SignIn');
  };

  const handleUpdateProfile = () => {
    // Handle profile update logic here
  };

  const handleUpdatePassword = () => {
    // Handle password update logic here
  };

  const handleTogglePrivacy = () => {
    // Handle privacy toggle logic here
  };

  return (
    <div className="candidate-settings">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={28} />
            <h1 className="logo">CandidateHub</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <Link to="/candidate-dashboard" className="nav-link">
            <BarChart3 size={18} />
            Dashboard
          </Link>
          <Link to="/browse-jobs" className="nav-link">
            <Search size={18} />
            Browse Jobs
          </Link>
          <Link to="/applications" className="nav-link">
            <FileText size={18} />
            Applications
          </Link>
          <Link to="/help" className="nav-link">
            <HelpCircle size={18} />
            Help Center
          </Link>
        </nav>

        <div className="header-right">
          <div className="notifications">
            <Bell className="notification-bell" size={20} />
            <span className="notification-badge">3</span>
          </div>
          <Link to="/candidate-settings">
            <div className="user-profile">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Candidate</span>
              </div>
            </div>
          </Link>
          <button 
            type="button" 
            className="signout-btn"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="settings-main">
        <div className="settings-container">
          <h1 className="page-title">Profile Settings</h1>
          
          {/* Edit Profile Section */}
          <section className="settings-section">
            <h2 className="section-title">Edit Profile</h2>
            <div className="section-content">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Alex Jordan" 
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  defaultValue="alex.jordan@candidate.pulse" 
                />
              </div>
              
              <div className="form-group">
                <label>Professional Bio</label>
                <textarea 
                  defaultValue="Senior Product Designer with over 8 years of experience creating user-centered digital products. Passionate about design systems, user research, and collaborative problem-solving. Currently leading design initiatives at a fast-growing tech startup."
                  rows={4}
                />
              </div>
              
              <div className="form-actions">
                <button className="btn-primary" onClick={handleUpdateProfile}>
                  Update Profile
                </button>
              </div>
            </div>
          </section>

          {/* Change Password Section */}
          <section className="settings-section">
            <h2 className="section-title">Change Password</h2>
            <div className="section-content">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    defaultValue="••••••••"
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type={showNewPassword ? 'text' : 'password'} 
                  placeholder="Min. 8 characters"
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type={showNewPassword ? 'text' : 'password'} 
                  placeholder="Re-type new password"
                />
              </div>
              
              <div className="form-actions">
                <button className="btn-primary" onClick={handleUpdatePassword}>
                  Update Password
                </button>
              </div>
            </div>
          </section>

          {/* Account Privacy Section */}
          <section className="settings-section">
            <h2 className="section-title">Account Privacy</h2>
            <div className="section-content">
              <div className="privacy-item">
                <div className="privacy-info">
                  <h4>Profile Visibility</h4>
                  <p>Control if your profile is searchable within platform.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked onChange={handleTogglePrivacy} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="browse-footer">
        <div className="footer-brand">
          <strong>WHS Solution</strong>
          <span>© 2024 WHS Solution Engineered for Excellence.</span>
        </div>
        <div className="footer-links">
          <a href="#">LEGAL</a>
          <a href="#">PRIVACY POLICY</a>
          <a href="#">HELP CENTER</a>
          <a href="#">CONTACT SUPPORT</a>
        </div>
      </footer>
    </div>
  );
};

export default CandidateSettingsPage;
