import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  const location = useLocation();

  return (
    <header className="browse-header">
      <div className="brand-row">
        <div className="brand-logo">
          <Link to="/" className="brand-link">CandidateHub</Link>
        </div>
        <nav className="nav-links">
          <Link 
            to="/browse-jobs" 
            className={location.pathname === '/browse-jobs' ? 'active' : ''}
          >
            Browse Jobs
          </Link>
          <Link 
            to="/applications" 
            className={location.pathname === '/applications' ? 'active' : ''}
          >
            Applications
          </Link>
          <Link 
            to="/create-profile" 
            className={location.pathname === '/create-profile' ? 'active' : ''}
          >
            Profile & Settings
          </Link>
        </nav>
      </div>

      <div className="header-actions">
        <button type="button" className="icon-btn" aria-label="Notifications">
          <span className="icon">🔔</span>
        </button>
        <button type="button" className="icon-btn" aria-label="Settings">
          <span className="icon">⚙️</span>
        </button>
        <div className="profile-chip">
          <span className="avatar">JS</span>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
