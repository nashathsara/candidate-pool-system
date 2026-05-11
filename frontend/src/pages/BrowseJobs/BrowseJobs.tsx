import { useEffect, useMemo, useState } from "react";
import { Search, Bell, Settings, MapPin } from "lucide-react";
import "./BrowseJobs.css";
import { fetchJobs } from "../../services/firebaseService";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type Job = {
  id: string;
  title?: string;
  location?: string;
  jobType?: string;
  salary?: string;
  badge?: string;
};

type JobFilters = {
  department?: string;
  location?: string;
  jobType?: string;
};

function BrowseJobs() {
  const navigate = useNavigate();
  const { user, loading, isSignedIn } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pageSize] = useState<number>(6);
  const [page, setPage] = useState<number>(1);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
        const { jobs: fetchedJobs, lastVisible: newLastVisible } = await fetchJobs(
          filters,
          pageSize,
          lastVisible,
        );
        setJobs(fetchedJobs as Job[]);
        setLastVisible(newLastVisible);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load jobs";
        setError(message);
      } finally {
        setLoadingJobs(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canLoad, filters, page, pageSize]);

  const handleFindJobs = () => {
    setPage(1);
    setLastVisible(null);
    // triggers useEffect because page/lastVisible are dependencies indirectly (page is)
  };

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
            <a href="/settings">Profile</a>
          </nav>

          <div className="header-right">
            <button type="button" className="icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button type="button" className="icon-btn" aria-label="Settings">
              <Settings size={18} />
            </button>
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
                onChange={(e) => {
                  // This UI search isn't wired to Firestore filtering yet (Firestore needs query fields).
                  // Keep it for future enhancement.
                  void e;
                }}
              />
            </div>

            <select
              value={filters.department ?? ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value || undefined }))}
            >
              <option value="">Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Operations">Operations</option>
            </select>

            <select
              value={filters.location ?? ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value || undefined }))}
            >
              <option value="">Location</option>
              <option value="Remote">Remote</option>
              <option value="San Francisco, CA">San Francisco, CA</option>
              <option value="Tokyo, Japan">Tokyo, Japan</option>
            </select>

            <select
              value={filters.jobType ?? ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value || undefined }))}
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
            {loadingJobs ? "LOADING..." : `SHOWING ${jobs.length} OPEN POSITIONS`}
          </p>
        </section>

        {error && (
          <div style={{ padding: 16, color: "crimson" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="jobs-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-card-top">
                <div className="job-icon-box">{job.badge ?? "🧠"}</div>
                <span className="job-badge">{job.badge ?? "ENGINEERING"}</span>
              </div>

              <div className="job-card-body">
                <h2>{job.title ?? "Untitled position"}</h2>
                <div className="job-detail-row">
                  <MapPin size={16} className="location-icon" />
                  <span>{job.location ?? "Location not set"}</span>
                </div>
                <p className="job-type">{job.jobType ?? "Job type not set"}</p>
              </div>

              <div className="job-card-footer">
                <span className="job-salary">{job.salary ?? ""}</span>
                <a href="#" className="details-link">
                  View Details →
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="pagination-row">
          <button type="button" className={`page-btn ${page === 1 ? "active" : ""}`} onClick={() => setPage(1)}>
            1
          </button>
          <button
            type="button"
            className="page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={!lastVisible}
          >
            2
          </button>
          <button
            type="button"
            className="page-btn"
            onClick={() => setPage((p) => p + 2)}
            disabled={!lastVisible}
          >
            3
          </button>
        </section>
      </main>
    </div>
  );
}

export default BrowseJobs;
