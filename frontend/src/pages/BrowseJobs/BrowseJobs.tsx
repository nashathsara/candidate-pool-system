import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, Settings, MapPin } from "lucide-react";
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
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [lastFetchedCount, setLastFetchedCount] = useState<number>(0);

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
        setLastFetchedCount((jobs as Job[]).length);
        setPage(1);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load jobs";
        setError(message);
        setAllJobs([]);
        setLastFetchedCount(0);
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
            <Link to="/jobs" className={window.location.pathname === "/jobs" ? "nav-link active" : "nav-link"}>
              Browse Jobs
            </Link>
            <Link to="/applications" className={window.location.pathname === "/applications" ? "nav-link active" : "nav-link"}>
              Applications
            </Link>
            <Link to="/profile" className={window.location.pathname === "/profile" ? "nav-link active" : "nav-link"}>
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

            <div className="avatar">{user?.email?.[0]?.toUpperCase() ?? "U"}</div>
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
              <Search size={18} className="search-icon" />
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

          <p style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
            Debug: Fetched jobs: <strong>{lastFetchedCount}</strong> (filters:{" "}
            <span>
              {filters.department ?? "∅"}/{filters.location ?? "∅"}/{filters.jobType ?? "∅"}
            </span>
            )
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
                <Link to={`/jobs/${job.id}`} className="job-title-link">
                  <h2>{job.title ?? "Untitled position"}</h2>
                </Link>
                <div className="job-detail-row">
                  <MapPin size={16} className="location-icon" />
                  <span>{job.location ?? "Location not set"}</span>
                </div>
                <p className="job-type">{job.jobType ?? "Job type not set"}</p>
                <p className="job-description">
                  {job.description || "No description available for this position."}
                </p>
              </div>
              <div className="job-card-footer">
                <span className="job-salary">{job.salary ?? ""}</span>
                <Link to={`/jobs/${job.id}`} className="details-link">
                  View Details →
                </Link>
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
      </main>
    </div>
  );
}

export default BrowseJobs;