import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Settings, MapPin, X } from "lucide-react";
import "./BrowseJobs.css";
import { fetchJobs } from "../../services/firebaseService";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

type Job = {
  id: string;
  title?: string;
  location?: string;
  jobType?: string;
  salary?: string;
  badge?: string;
  description?: string;
  department?: string;
};

const jobRoleDescriptions: Record<string, string> = {
  "Senior Software Engineer":
    "A high-level technical role focused on building and maintaining complex web applications. You’ll be responsible for the full development lifecycle—from writing clean code to mentoring junior staff—ensuring that global platforms remain scalable, secure, and high-performing.",
  "Principal UX Designer":
    "A strategic leadership position that oversees the look and feel of digital products. This role combines user research with hands-on design (wireframing and prototyping) to create intuitive experiences, while also maintaining a cohesive design system across the entire organization.",
  "Backend Developer (Rust)":
    "A specialized engineering role focused on high-performance infrastructure. Using the Rust programming language, you will design the \"under-the-hood\" systems, such as APIs and microservices, that ensure data flows quickly and reliably across distributed networks.",
  "Technical Project Manager":
    "The bridge between business goals and technical execution. This role involves planning timelines, managing risks, and leading Agile ceremonies (like sprint planning) to ensure that software projects are delivered on time, within budget, and according to quality standards.",
  "Security Analyst":
    "A critical defense role dedicated to protecting company data from cyber threats. You will spend your time monitoring for vulnerabilities, conducting risk assessments, and responding to incidents to ensure the company's digital infrastructure remains secure and compliant.",
  "Product Owner":
    "A leadership role that acts as the \"voice of the customer\" within the development team. You are responsible for defining the product roadmap, prioritizing the feature backlog, and ensuring that every technical task aligns with the overall business strategy and user needs.",
};

type JobFilters = {
  department?: string;
  location?: string;
  jobType?: string;
};

const PAGE_SIZE = 6;

function BrowseJobs() {
  const navigate = useNavigate();
  const { user, loading, isSignedIn } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Pagination logic linked to URL
  const page = parseInt(searchParams.get("page") || "1", 10);
  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const canLoad = useMemo(() => !loading && isSignedIn, [loading, isSignedIn]);

  useEffect(() => {
    if (!loading && !isSignedIn) {
      navigate("/signin");
    }
  }, [canLoad, isSignedIn, loading, navigate]);

  useEffect(() => {
    if (!canLoad) return;

    const load = async () => {
      setLoadingJobs(true);
      setError("");
      try {
        const { jobs } = await fetchJobs(filters, PAGE_SIZE, null);
        setAllJobs(jobs as Job[]);
        setPage(1);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load jobs";
        setError(message);
        setAllJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canLoad, filters]);

  // Effect to handle clicks outside the notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false);
      }
    };

    if (showNotificationsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotificationsDropdown]);

  const normalizedSearch = useMemo(() => searchQuery.trim().toLowerCase(), [searchQuery]);

  const searchFilteredJobs = useMemo(() => {
    if (!normalizedSearch) return allJobs;

    return allJobs.filter((job) => {
      const haystack = [
        job.title,
        job.location,
        job.jobType,
        job.department,
        job.badge,
        job.description,
        job.salary,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [allJobs, normalizedSearch]);

  // Reset pagination when search changes
  useEffect(() => {
    setPage(1);
  }, [normalizedSearch]);

  const totalPages = Math.max(1, Math.ceil(searchFilteredJobs.length / PAGE_SIZE));

  const visibleJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return searchFilteredJobs.slice(start, start + PAGE_SIZE);
  }, [searchFilteredJobs, page]);

  const handleFindJobs = () => {
    setPage(1);
  };

  return (
    <div className="browse-page">
      <header className="browse-header">
        <div className="header-container">
          <div className="header-left">
            <div className="header-logo">CandidateHub</div>
          </div>

          <nav className="header-nav">
            <Link to="/browse" className={window.location.pathname === "/browse" ? "nav-link active" : "nav-link"}>
              Browse Jobs
            </Link>
            <Link to="/applications" className={window.location.pathname === "/applications" ? "nav-link active" : "nav-link"}>
              Applications
            </Link>
            <Link to="/candidate-dashboard" className={window.location.pathname === "/candidate-dashboard" ? "nav-link active" : "nav-link"}>
              Profile
            </Link>
          </nav>

          <div className="header-right">
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                className="icon-btn"
                aria-label="Notifications"
                onClick={() => setShowNotificationsDropdown((prev) => !prev)}
              >
                <Bell size={18} />
              </button>
              {showNotificationsDropdown && (
                <div className="notifications-dropdown">
                  <p className="dropdown-title">Notifications</p>
                  <ul className="dropdown-list">
                    <li>New job match found: Senior React Developer!</li>
                    <li>Your application for UX Designer has been reviewed.</li>
                    <li>System update: New features available.</li>
                  </ul>
                </div>
              )}
            </div>
            <Link to="/settings" className="icon-btn" aria-label="Settings">
              <Settings size={18} />
            </Link>

            <Link to="/candidate-dashboard" className="avatar-link" aria-label="Profile">
              <div className="avatar">{user?.email?.[0]?.toUpperCase() ?? "U"}</div>
            </Link>
          </div>
        </div>
      </header>

      <main className="browse-content">
        <section className="hero-section">
          <div className="hero-copy">
            <h1>Join the Future of Engineering</h1>
            <p>Browse our current openings across globally distributed teams.</p>
          </div>

          <div className="search-panel">
            <div className="search-field">
              <input
                type="search"
                placeholder="Search by title, keywords, or technology..."
                aria-label="Search jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              value={filters.department ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, department: e.target.value || undefined }))
              }
            >
              <option value="">Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Operations">Operations</option>
            </select>

            <select
              value={filters.location ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value || undefined }))
              }
            >
              <option value="">Location</option>
              <option value="Remote">Remote</option>
              <option value="San Francisco, CA">San Francisco, CA</option>
              <option value="Tokyo, Japan">Tokyo, Japan</option>
            </select>

            <select
              value={filters.jobType ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, jobType: e.target.value || undefined }))
              }
            >
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>

            <button type="button" className="find-btn" onClick={handleFindJobs}>
              Find Jobs
            </button>
          </div>
        </section>

        <section className="jobs-summary">
          <p className="summary-title">
            {loadingJobs ? "LOADING..." : `SHOWING ${visibleJobs.length} OPEN POSITIONS`}
          </p>

        </section>

        {error && (
          <div style={{ padding: 16, color: "crimson" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {allJobs.length === 0 && !loadingJobs && !error && (
          <div style={{ padding: 16, color: "#0f172a" }}>
            No jobs returned from Firestore. Please check your <code>jobs</code> collection data.
          </div>
        )}

        <section className="jobs-grid">
          {visibleJobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-card-top">
                <div className="job-icon-box">{job.badge ?? "🧠"}</div>
                <span className="job-badge">{job.badge ?? "GENERAL"}</span>
              </div>

              <div className="job-card-body">
                <h2>{job.title ?? "Untitled position"}</h2>
                <div className="job-detail-row">
                  <MapPin size={16} className="location-icon" />
                  <span>{job.location ?? "Location not set"}</span>
                </div>
                <p className="job-type">{job.jobType ?? "Job type not set"}</p>
                <p className="job-description">
                  {job.description || jobRoleDescriptions[job.title ?? ""] || "No description available for this position."}
                </p>
              </div>
              <div className="job-card-footer">
                <span className="job-salary">{job.salary ?? ""}</span>
                <button
                  type="button"
                  className="details-link"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJobModal(true);
                  }}
                >
                  View Details →
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="pagination-row">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              className={`page-btn ${page === num ? "active" : ""}`}
              onClick={() => setPage(num)}
              disabled={totalPages < num}
            >
              {num}
            </button>
          ))}
        </section>

        {showJobModal && selectedJob && (
          <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowJobModal(false)}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="modal-header">
                <div className="job-icon-box-large">🧠</div>
                <div className="modal-header-text">
                  <span className="job-badge-large">{selectedJob.badge ?? "GENERAL"}</span>
                  <h1>{selectedJob.title ?? "Untitled position"}</h1>
                </div>
              </div>

              <div className="modal-body">
                <div className="modal-detail-row">
                  <span className="detail-label">Location:</span>
                  <div className="detail-content">
                    <MapPin size={16} />
                    <span>{selectedJob.location ?? "Location not set"}</span>
                  </div>
                </div>

                <div className="modal-detail-row">
                  <span className="detail-label">Job Type:</span>
                  <span className="detail-content">{selectedJob.jobType ?? "Job type not set"}</span>
                </div>

                <div className="modal-detail-row">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-content">{selectedJob.salary ?? "Not specified"}</span>
                </div>

                <div className="modal-detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-content">{selectedJob.department ?? "Not specified"}</span>
                </div>

                <div className="modal-description-section">
                  <h3>Job Description</h3>
                  <p>
                    {selectedJob.description ||
                      jobRoleDescriptions[selectedJob.title ?? ""] ||
                      "No description available for this position."}
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="apply-btn"
                  onClick={() => {
                    setShowJobModal(false);
                    navigate("/applications");
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default BrowseJobs;