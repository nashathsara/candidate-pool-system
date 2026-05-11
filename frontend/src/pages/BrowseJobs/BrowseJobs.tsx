import { Search, Bell, Settings, MapPin } from 'lucide-react'
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
        <div className="header-container">
          <div className="header-left">
            <div className="header-logo">CandidateHub</div>
          </div>

          <nav className="header-nav">
            <a href="/browse" className="nav-link active">
              Browse Jobs
            </a>
            <a href="#">Applications</a>
            <a href="#">Profile</a>
          </nav>

          <div className="header-right">
            <button type="button" className="icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button type="button" className="icon-btn" aria-label="Settings">
              <Settings size={18} />
            </button>
            <div className="avatar">JS</div>
          </div>
        </div>
      </header>

      <main className="browse-content">
        <section className="hero-section">
          <div className="hero-copy">
            <h1>Join the Future of Engineering</h1>
            <p>
              WHS Solution is where high-performance engineering meets elegant design.
              Browse our current openings across globally distributed teams.
            </p>
          </div>

          <div className="search-panel">
            <div className="search-field">
              <Search size={18} className="search-icon" />
              <input
                type="search"
                placeholder="Search by title, keywords, or technology..."
                aria-label="Search jobs"
              />
            </div>
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
        </section>

        <section className="jobs-summary">
          <p className="summary-title">SHOWING 6 OPEN POSITIONS</p>
        </section>

        <section className="jobs-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.title}>
              <div className="job-card-top">
                <div className="job-icon-box">{job.icon}</div>
                <span className="job-badge">{job.badge}</span>
              </div>

              <div className="job-card-body">
                <h2>{job.title}</h2>
                <div className="job-detail-row">
                  <MapPin size={16} className="location-icon" />
                  <span>{job.location}</span>
                </div>
                <p className="job-type">{job.type}</p>
              </div>

              <div className="job-card-footer">
                <span className="job-salary">{job.salary}</span>
                <a href="#" className="details-link">
                  View Details →
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="pagination-row">
          <button type="button" className="page-btn active">1</button>
          <button type="button" className="page-btn">2</button>
          <button type="button" className="page-btn">3</button>
        </section>
      </main>

      <footer className="browse-footer">
        <div className="footer-brand">
          <span className="footer-title">WHS Solution</span>
          <span className="footer-copy">© 2024 WHS Solution Engineered for Excellence.</span>
        </div>
        <div className="footer-links">
          <a href="#">Legal</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Help Center</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  )
}

export default BrowseJobs
