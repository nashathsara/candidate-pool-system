import { Link } from "react-router-dom";
import type { CandidateRecord } from "../../../utils/candidateTypes";
import { CandidateStatusBadge } from "../../candidate/CandidateStatusBadge/CandidateStatusBadge";
import "./AdminDashboard.css";

const SearchIco = () => (
  <svg viewBox="0 0 24 24" fill="none" className="admin-top-icon-svg">
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const FilterSlidersIco = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
    <path d="M4 6h16M8 12h8M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

interface AdminDashboardProps {
  /** Rows for the talent pipeline table */
  pipelineCandidates: CandidateRecord[];
}

const AdminDashboard = ({ pipelineCandidates }: AdminDashboardProps) => {
  const rows = pipelineCandidates.slice(0, 6);

  return (
    <div className="ad-dashboard">
      <div className="ad-search-row">
        <div className="ad-search-field">
          <span className="ad-sico">
            <SearchIco />
          </span>
          <input
            type="search"
            className="ad-search-input"
            placeholder="Global Candidate Search..."
            aria-label="Global candidate search"
          />
        </div>
        <button type="button" className="ad-filters-btn">
          <FilterSlidersIco />
          Filters
        </button>
      </div>

      <section className="ad-metrics" aria-label="Key metrics">
        <div className="ad-metric-card">
          <div className="ad-metric-label">Total Candidates</div>
          <div className="ad-metric-value">12,482</div>
          <span className="ad-pill ad-pill-blue">+12%</span>
        </div>
        <div className="ad-metric-card">
          <div className="ad-metric-label">New Applications</div>
          <div className="ad-metric-value">156</div>
          <span className="ad-pill ad-pill-red">+85</span>
        </div>
        <div className="ad-metric-card">
          <div className="ad-metric-label">Actively Looking</div>
          <div className="ad-metric-value">14</div>
          <span className="ad-pill ad-pill-green">✓</span>
        </div>
        <div className="ad-metric-card">
          <div className="ad-metric-label">Pending Reviews</div>
          <div className="ad-metric-value">42</div>
          <span className="ad-pill ad-pill-outline">Action Req.</span>
        </div>
      </section>

      <div className="ad-analytics-row">
        <div className="ad-card">
          <h3 className="ad-card-title">Department Distribution</h3>
          <div className="ad-donut-wrap">
            <div className="ad-donut" role="img" aria-label="Donut chart: Tech 45%, Product 25%, Design 20%, Sales 10%">
              <div className="ad-donut-inner">
                100%
                <span style={{ fontWeight: 600, color: "#6b7280" }}>Talent Pool</span>
              </div>
            </div>
            <div className="ad-legend">
              <div className="ad-legend-row">
                <span className="ad-dot" style={{ background: "#3b82f6" }} />
                Tech — 45%
              </div>
              <div className="ad-legend-row">
                <span className="ad-dot" style={{ background: "#8b5cf6" }} />
                Product — 25%
              </div>
              <div className="ad-legend-row">
                <span className="ad-dot" style={{ background: "#10b981" }} />
                Design — 20%
              </div>
              <div className="ad-legend-row">
                <span className="ad-dot" style={{ background: "#f59e0b" }} />
                Sales — 10%
              </div>
            </div>
          </div>
        </div>

        <div className="ad-card">
          <h3 className="ad-card-title">Experience Categories</h3>
          <div className="ad-bars">
            {[
              { label: "Junior (0–2 Years)", count: "18,245", pct: 33, color: "#10b981" },
              { label: "Mid-Level (3–6 Years)", count: "24,510", pct: 44, color: "#1e40af" },
              { label: "Lead/Director (7+ Years)", count: "12,066", pct: 22, color: "#64748b" },
            ].map((b) => (
              <div key={b.label} className="ad-bar-row">
                <div className="ad-bar-label">{b.label}</div>
                <div className="ad-bar-track">
                  <div
                    className="ad-bar-fill"
                    style={{ width: `${b.pct}%`, background: b.color }}
                  />
                </div>
                <div className="ad-bar-count">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section aria-label="Talent availability pipeline">
        <h3 className="ad-pipeline-title">Talent Availability Pipeline</h3>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Category</th>
                <th>Verification Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#6b7280" }}>
                    No candidates yet. Use{" "}
                    <Link to="/profile/create" style={{ color: "#2563eb" }}>
                      Create profile
                    </Link>{" "}
                    to add someone to the pool.
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="ad-cand-cell">
                        <div className="ad-cand-av">{c.initials}</div>
                        <div>
                          <div className="ad-cand-name">{c.name}</div>
                          <div className="ad-cand-role">{c.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.category}</td>
                    <td>
                      <CandidateStatusBadge status={c.verificationStatus} />
                    </td>
                    <td>{c.lastActiveLabel}</td>
                    <td>
                      <Link
                        to={`/candidates/${c.id}`}
                        className="ad-review-btn"
                      >
                        Review Profile
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
