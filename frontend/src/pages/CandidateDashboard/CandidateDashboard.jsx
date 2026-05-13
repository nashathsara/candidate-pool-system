import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, FileText, HelpCircle, Bell, Search, TrendingUp, Clock, CheckCircle, AlertCircle, Star, ArrowRight, Calendar, MessageSquare, BarChart3, LogOut } from 'lucide-react';
import './CandidateDashboard.css';

const CandidateDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/SignIn');
  };

  return (
    <div className="candidate-dashboard">
      {/* Enhanced Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={28} />
            <h1 className="logo">CandidateHub</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <Link to="/candidate-dashboard" className="nav-link active">
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
      <main className="dashboard-main">
        {/* Enhanced Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-text">
              <h2 className="welcome-title">Welcome back, John! 👋</h2>
              <p className="welcome-subtitle">Your profile is 85% complete. Complete it to increase your visibility to recruiters.</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
              <span className="progress-text">85%</span>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Stats Overview */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">
                <Briefcase size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">8</div>
                <div className="stat-label">Saved Jobs</div>
                <div className="stat-change positive">+2 this week</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">3</div>
                <div className="stat-label">Applications</div>
                <div className="stat-change positive">+1 this week</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <MessageSquare size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">5</div>
                <div className="stat-label">Messages</div>
                <div className="stat-change neutral">2 unread</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">92%</div>
                <div className="stat-label">Profile Strength</div>
                <div className="stat-change positive">Excellent</div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="dashboard-content">
            {/* Enhanced Main Card */}
            <div className="candidate-home-card">
              <div className="card-header">
                <div className="card-label-section">
                  <span className="card-label">CANDIDATE HOME</span>
                  <div className="card-status">
                    <CheckCircle size={16} className="status-icon" />
                    <span>Profile Active</span>
                  </div>
                </div>
                <h3 className="card-title">Ready for your next career move?</h3>
              </div>
              <p className="card-description">
                Your profile is getting noticed! 3 recruiters viewed your profile this week. 
                Keep your information updated and explore new opportunities that match your skills.
              </p>
              <div className="card-highlights">
                <div className="highlight-item">
                  <Star size={16} className="highlight-icon" />
                  <span>Top 10% candidate profile</span>
                </div>
                <div className="highlight-item">
                  <TrendingUp size={16} className="highlight-icon" />
                  <span>Profile views increased by 45%</span>
                </div>
              </div>
              <div className="card-actions">
                <Link to="/browse-jobs" className="btn btn-primary">
                  <Search size={18} />
                  Browse Jobs
                </Link>
                <Link to="/create-profile" className="btn btn-secondary">
                  <FileText size={18} />
                  Update Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="dashboard-sidebar">
            {/* Profile Status Card */}
            <div className="profile-status-card">
              <div className="status-header">
                <span className="status-label">Profile Status</span>
                <span className="status-badge verified">VERIFIED</span>
              </div>
              <div className="profile-completion">
                <div className="completion-item">
                  <CheckCircle size={16} className="completion-icon complete" />
                  <span>Basic Information</span>
                </div>
                <div className="completion-item">
                  <CheckCircle size={16} className="completion-icon complete" />
                  <span>Work Experience</span>
                </div>
                
                <div className="completion-item">
                  <AlertCircle size={16} className="completion-icon incomplete" />
                  <span>Skills & Certifications</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-card">
              <h3 className="activity-title">Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <Briefcase size={16} />
                  </div>
                  <div className="activity-content">
                    <span className="activity-text">Applied to Senior Developer position</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <MessageSquare size={16} />
                  </div>
                  <div className="activity-content">
                    <span className="activity-text">New message from recruiter</span>
                    <span className="activity-time">5 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <TrendingUp size={16} />
                  </div>
                  <div className="activity-content">
                    <span className="activity-text">Profile strength increased</span>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions Section */}
        <section className="quick-actions">
          <div className="section-header">
            <h3 className="section-title">QUICK ACTIONS</h3>
            <p className="section-subtitle">Get started with these common tasks</p>
          </div>
          <div className="quick-actions-grid">
            <div className="action-card">
              <div className="action-icon">
                <BarChart3 size={24} />
              </div>
              <h4 className="action-title">Application Tracker</h4>
              <p className="action-description">Monitor your application status and follow up with recruiters</p>
              <div className="action-link">
                <span>View Applications</span>
                <ArrowRight size={16} />
              </div>
            </div>
            <div className="action-card">
              <div className="action-icon">
                <FileText size={24} />
              </div>
              <h4 className="action-title">Update Resume</h4>
              <p className="action-description">Keep your resume fresh and tailored to new opportunities</p>
              <div className="action-link">
                <span>Upload Resume</span>
                <ArrowRight size={16} />
              </div>
            </div>
            <div className="action-card">
              <div className="action-icon">
                <Calendar size={24} />
              </div>
              <h4 className="action-title">Schedule Interview</h4>
              <p className="action-description">Book interview slots and manage your calendar</p>
              <div className="action-link">
                <span>View Calendar</span>
                <ArrowRight size={16} />
              </div>
            </div>
            <div className="action-card">
              <div className="action-icon">
                <HelpCircle size={24} />
              </div>
              <h4 className="action-title">Help Center</h4>
              <p className="action-description">Get quick answers or open a ticket with our support team</p>
              <div className="action-link">
                <span>Get Help</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </section>
      </main>

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

export default CandidateDashboard;
