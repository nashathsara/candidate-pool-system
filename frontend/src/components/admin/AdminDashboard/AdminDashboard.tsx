import { Link } from "react-router-dom";
import { Bell, CalendarCheck, CheckCircle2, FileText, SlidersHorizontal, Users } from "lucide-react";
import type { CandidateRecord } from "../../../utils/candidateTypes";
import "./AdminDashboard.css";

interface AdminDashboardProps {
  pipelineCandidates: CandidateRecord[];
}

const metricCards = [
  {
    label: "Total Candidates",
    value: "12,482",
    badge: "+12%",
    badgeClass: "ad-badge-blue",
    icon: <Users size={18} />,
  },
  {
    label: "New Applications",
    value: "156",
    badge: "+85",
    badgeClass: "ad-badge-red",
    icon: <FileText size={18} />,
  },
  {
    label: "Actively Looking",
    value: "14",
    badge: "Today",
    badgeClass: "ad-badge-muted",
    icon: <CheckCircle2 size={18} />,
  },
  {
    label: "Pending Reviews",
    value: "42",
    badge: "Action Req.",
    badgeClass: "ad-badge-action",
    icon: <CalendarCheck size={18} />,
  },
];

const departments = [
  { label: "Tech", value: "45%", color: "#1b3a4b" },
  { label: "Product", value: "25%", color: "#3ec9a7" },
  { label: "Design", value: "20%", color: "#505f76" },
  { label: "Sales", value: "10%", color: "#76777d" },
];

const experienceBands = [
  { label: "Junior (0-2 Years)", value: "18,245", pct: 33, color: "#3ec9a7" },
  { label: "Mid-Level (3-6 Years)", value: "24,510", pct: 55, color: "#1b3a4b" },
  { label: "Lead/Director (7+ Years)", value: "12,066", pct: 22, color: "#505f76" },
];

const avatarColors = ["#dae2fd", "#d3e4fe", "#d5dbff", "#d9d9de", "#ffd3d3"];

const AdminDashboard = ({ pipelineCandidates }: AdminDashboardProps) => {
  const rows = pipelineCandidates.slice(0, 5);

  return (
    <div className="ad-dashboard">
      <header className="ad-topbar">
        <h1>Dashboard Overview</h1>
        <div className="ad-user-actions">
          <button className="ad-icon-button" aria-label="Notifications" type="button">
            <Bell size={20} />
          </button>
          <span className="ad-divider" />
          <div className="ad-user">
            <span className="ad-user-avatar">AC</span>
            <strong>Alex Chen</strong>
          </div>
        </div>
      </header>

      <div className="ad-search-row">
        <div className="ad-search-field">
          <span className="ad-sico" aria-hidden="true">⌕</span>
          <input
            type="search"
            className="ad-search-input"
            placeholder="Global Candidate Search..."
            aria-label="Global candidate search"
          />
        </div>
        <button type="button" className="ad-filters-btn">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <section className="ad-metrics" aria-label="Key metrics">
        {metricCards.map((metric) => (
          <article className="ad-metric-card" key={metric.label}>
            <div className="ad-metric-head">
              <span className="ad-metric-icon">{metric.icon}</span>
              <span className={`ad-metric-badge ${metric.badgeClass}`}>{metric.badge}</span>
            </div>
            <div className="ad-metric-label">{metric.label}</div>
            <div className="ad-metric-value">{metric.value}</div>
          </article>
        ))}
      </section>

      <div className="ad-analytics-row">
        <section className="ad-card">
          <h2 className="ad-card-title">Department Distribution</h2>
          <div className="ad-donut-wrap">
            <div className="ad-donut" role="img" aria-label="Donut chart: Tech 45%, Product 25%, Design 20%, Sales 10%">
              <div className="ad-donut-inner">
                <strong>100%</strong>
                <span>Talent Pool</span>
              </div>
            </div>
            <div className="ad-legend">
              {departments.map((department) => (
                <div className="ad-legend-row" key={department.label}>
                  <span className="ad-legend-name">
                    <span className="ad-dot" style={{ background: department.color }} />
                    {department.label}
                  </span>
                  <strong style={{ color: department.color }}>{department.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ad-card">
          <div className="ad-card-head">
            <h2 className="ad-card-title">Experience Categories</h2>
            <span>Candidate Count / Trend</span>
          </div>
          <div className="ad-bars">
            {experienceBands.map((band) => (
              <div key={band.label} className="ad-bar-row">
                <div className="ad-bar-top">
                  <span>{band.label}</span>
                  <strong>{band.value}</strong>
                </div>
                <div className="ad-bar-track">
                  <div
                    className="ad-bar-fill"
                    style={{ width: `${band.pct}%`, background: band.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ad-pipeline" aria-label="Talent availability pipeline">
        <div className="ad-pipeline-header">
          <h2>Talent Availability Pipeline</h2>
          <Link to="/candidates">View All Records</Link>
        </div>

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
                  <td colSpan={5} className="ad-empty">
                    No candidates yet. Use <Link to="/profile/create">Create profile</Link> to add someone to the pool.
                  </td>
                </tr>
              ) : (
                rows.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="ad-cand-cell">
                        <div
                          className="ad-cand-av"
                          style={{ background: avatarColors[index % avatarColors.length] }}
                        >
                          {candidate.initials}
                        </div>
                        <div>
                          <div className="ad-cand-name">{candidate.name}</div>
                          <div className="ad-cand-role">{candidate.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>{candidate.category}</td>
                    <td>
                      <span className={`ad-status ad-status-${index}`}>
                        {candidate.verificationStatus}
                      </span>
                    </td>
                    <td>{candidate.lastActiveLabel}</td>
                    <td>
                      <Link to={`/candidates/${candidate.id}`} className="ad-review-btn">
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
