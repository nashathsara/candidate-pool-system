import { Link } from 'react-router-dom';
import { User, Briefcase, FileText, HelpCircle, Bell, Settings, Search } from 'lucide-react';
import './BrowseJobs.css'

const jobs = [
  {
    title: 'Senior Software Engineer',
    badge: 'ENGINEERING',
    location: 'Remote - EMEA',
    type: 'Full-time',
    salary: '$140k - $190k',
    icon: '🧠',
  },
  {
    title: 'Principal UX Designer',
    badge: 'PRODUCT DESIGN',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$160k - $210k',
    icon: '✏️',
  },
  {
    title: 'Backend Developer (Rust)',
    badge: 'ENGINEERING',
    location: 'London, UK / Remote',
    type: 'Full-time',
    salary: '$130k - $180k',
    icon: '💻',
  },
  {
    title: 'Technical Project Manager',
    badge: 'OPERATIONS',
    location: 'Hybrid - Berlin',
    type: 'Full-time',
    salary: '$110k - $150k',
    icon: '📌',
  },
  {
    title: 'Security Analyst',
    badge: 'ENGINEERING',
    location: 'Tokyo, Japan',
    type: 'Full-time',
    salary: '$120k - $170k',
    icon: '🛡️',
  },
  {
    title: 'Product Owner',
    badge: 'PRODUCT',
    location: 'Remote - US',
    type: 'Full-time',
    salary: '$130k - $175k',
    icon: '📦',
  },
]

function BrowseJobs() {
  return (
    <div className="browse-page">
      <header className="browse-header">
        <div className="header-left">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={28} />
            <h1 className="logo">CandidateHub</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <Link to="/candidate-dashboard" className="nav-link">
            <Briefcase size={18} />
            Dashboard
          </Link>
          <Link to="/browse-jobs" className="nav-link active">
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
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Candidate</span>
            </div>
            <Settings className="settings-icon" size={18} />
          </div>
        </div>
      </header>

      <main className="browse-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <h1>Join the Future of Engineering</h1>
            <p>
              WHS Solution is where high-performance engineering meets elegant design.
              Browse our current openings across globally distributed teams.
            </p>
          </div>

          <div className="search-card">
            <div className="search-input">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by title, keywords, or technology..."
              />
            </div>
            <div className="filters-row">
              <select>
                <option>Department</option>
                <option>Engineering</option>
                <option>Product Design</option>
                <option>Operations</option>
              </select>
              <select>
                <option>Location</option>
                <option>Remote</option>
                <option>San Francisco, CA</option>
                <option>Tokyo, Japan</option>
              </select>
              <select>
                <option>Job Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
              <button type="button" className="find-btn">
                Find Jobs
              </button>
            </div>
          </div>
        </section>

        <section className="jobs-summary">
          <div className="summary-text">SHOWING 12 OPEN POSITIONS</div>
          <div className="view-toggle">
            <button type="button" className="toggle-btn active">
              <span>▦</span>
            </button>
            <button type="button" className="toggle-btn">
              <span>☰</span>
            </button>
          </div>
        </section>

        <section className="jobs-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.title}>
              <div className="job-card-top">
                <span className="job-icon">{job.icon}</span>
                <span className="job-badge">{job.badge}</span>
              </div>

              <h2>{job.title}</h2>
              <div className="job-meta">
                <span>{job.location}</span>
                <span>{job.type}</span>
              </div>
              <div className="job-footer">
                <span className="job-salary">{job.salary}</span>
                <button type="button" className="details-link">
                  View Details →
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="pagination-row">
          <button type="button" className="page-btn">←</button>
          <button type="button" className="page-btn active">1</button>
          <button type="button" className="page-btn">2</button>
          <button type="button" className="page-btn">3</button>
          <button type="button" className="page-btn">→</button>
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
  )
}

export default BrowseJobs
