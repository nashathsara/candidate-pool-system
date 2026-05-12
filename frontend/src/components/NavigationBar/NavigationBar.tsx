import { Link, useLocation } from 'react-router-dom';
import { FiBell, FiSettings } from 'react-icons/fi';
import './NavigationBar.css';

const NavigationBar = () => {
  const location = useLocation();

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-name">CandidateHub</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link 
            to="/browse-jobs" 
            className={`nav-link ${location.pathname === '/browse-jobs' ? 'active' : ''}`}
          >
            Browse Jobs
          </Link>
          <Link 
            to="/applications" 
            className={`nav-link ${location.pathname === '/applications' ? 'active' : ''}`}
          >
            Applications
          </Link>
          <Link 
            to="/messages" 
            className={`nav-link ${location.pathname === '/messages' ? 'active' : ''}`}
          >
            Messages
          </Link>
        </div>

        {/* Right Section */}
        <div className="nav-actions">
          {/* Create Profile Button */}
          <Link to="/create-profile" className="create-profile-btn">
            Create Profile
          </Link>

          {/* Icons */}
          <div className="nav-icons">
            <button className="icon-btn" aria-label="Notifications">
              <FiBell className="icon" />
            </button>
            <button className="icon-btn" aria-label="Settings">
              <FiSettings className="icon" />
            </button>
            
            {/* User Avatar */}
            <div className="user-avatar">
              <img 
                src="https://picsum.photos/seed/user-avatar/40/40.jpg" 
                alt="User avatar" 
                className="avatar-img"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
