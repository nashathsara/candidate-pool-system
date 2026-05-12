import React from 'react';
import { Link } from 'react-router-dom';
import './CandidateDashboard.css';

const CandidateDashboard = () => {
  return (
    <div className="candidate-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">CandidateHub</h1>
        </div>
        <nav className="header-nav">
          <Link to="/candidate-dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/browse-jobs" className="nav-link">Browse Jobs</Link>
          <Link to="/applications" className="nav-link">Apply</Link>
          <Link to="/help" className="nav-link">Help Center</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2 className="welcome-title">Welcome back, Candidate</h2>
          <p className="welcome-subtitle">Your CandidateHub dashboard is ready to help you move forward.</p>
        </section>

        <div className="dashboard-content">
          {/* Left Column - Main Content */}
          <div className="dashboard-left">
            <div className="candidate-home-card">
              <div className="card-header">
                <span className="card-label">CANDIDATE HOME</span>
                <h3 className="card-title">Find your next role and keep your profile active.</h3>
              </div>
              <p className="card-description">
                Continue your application journey, explore curated roles, or open a new support ticket if you need assistance.
              </p>
              <div className="card-actions">
                <Link to="/browse-jobs" className="btn btn-primary">Browse Jobs</Link>
                <Link to="/create-profile" className="btn btn-secondary">Submit Application</Link>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Status */}
          <div className="dashboard-right">
            <div className="profile-status-card">
              <div className="status-header">
                <span className="status-label">Profile status</span>
                <span className="status-badge verified">VERIFIED</span>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">8</div>
                <div className="metric-label">Saved jobs</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">3</div>
                <div className="metric-label">Applications</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">1</div>
                <div className="metric-label">Support tickets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <section className="quick-actions">
          <h3 className="section-title">QUICK ACTIONS</h3>
          <div className="quick-actions-grid">
            <div className="action-card">
              <h4 className="action-title">Open Dashboard</h4>
              <p className="action-description">See your candidate progress and manage submissions.</p>
            </div>
            <div className="action-card">
              <h4 className="action-title">Submit an application</h4>
              <p className="action-description">Tell us your availability and skill profile for fast matching.</p>
            </div>
            <div className="action-card">
              <h4 className="action-title">Help Center</h4>
              <p className="action-description">Get quick answers or open a ticket with our support team.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CandidateDashboard;
