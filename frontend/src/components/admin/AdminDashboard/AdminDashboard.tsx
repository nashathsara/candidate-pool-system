import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarCheck, CheckCircle2, FileText, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { getNotifications, markNotificationsAsRead, type AdminNotification } from "../../../services/firebaseAdminService";
import type { CandidateRecord } from "../../../utils/candidateTypes";
import "./AdminDashboard.css";

interface AdminDashboardProps {
  error?: string;
  isLoading?: boolean;
  onRetry?: () => void;
  pipelineCandidates: CandidateRecord[];
}

type FilterState = {
  department: string;
  experienceLevel: string;
  category: string;
  availability: string;
  status: string;
  verificationStatus: string;
};

const emptyFilters: FilterState = {
  department: "",
  experienceLevel: "",
  category: "",
  availability: "",
  status: "",
  verificationStatus: "",
};

const avatarColors = ["#dae2fd", "#d3e4fe", "#d5dbff", "#d9d9de", "#ffd3d3"];

const normalize = (value?: string | number | boolean) => String(value ?? "").toLowerCase();

const getDepartment = (candidate: CandidateRecord) => {
  if (candidate.role.toLowerCase().includes("designer") || candidate.skills.some((skill) => /figma|ui|ux|design/i.test(skill))) {
    return "Design";
  }

  if (candidate.role.toLowerCase().includes("product")) {
    return "Product";
  }

  if (candidate.role.toLowerCase().includes("sales")) {
    return "Sales";
  }

  return "Tech";
};

const getAvailability = (candidate: CandidateRecord) =>
  candidate.availability ||
  (candidate.activelyLooking || candidate.status === "In Review" ? "Available" : "Passive");

const getExperienceYears = (candidate: CandidateRecord) => {
  const match = candidate.experience.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getExperienceLevel = (candidate: CandidateRecord) => {
  const years = getExperienceYears(candidate);

  if (years <= 2) {
    return "Junior";
  }

  if (years <= 6) {
    return "Mid-Level";
  }

  return "Lead / Director";
};

const getUniqueValues = (values: string[]) => [...new Set(values.filter(Boolean))].sort();

const formatPercent = (value: number, total: number) => (total ? Math.round((value / total) * 100) : 0);

const AdminDashboard = ({ error = "", isLoading = false, onRetry, pipelineCandidates }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [draftFilters, setDraftFilters] = useState<FilterState>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(emptyFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationError, setNotificationError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      setNotificationError("");
      try {
        const firebaseNotifications = await getNotifications();
        if (isMounted) {
          setNotifications(firebaseNotifications);
        }
      } catch (loadError) {
        if (isMounted) {
          setNotifications([]);
          setNotificationError(loadError instanceof Error ? loadError.message : "Unable to load notifications.");
        }
      }
    };

    void loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const enrichedCandidates = useMemo(
    () =>
      pipelineCandidates.map((candidate) => ({
        ...candidate,
        department: getDepartment(candidate),
        availability: getAvailability(candidate),
        experienceLevel: getExperienceLevel(candidate),
      })),
    [pipelineCandidates],
  );

  const filterOptions = useMemo(
    () => ({
      department: getUniqueValues(enrichedCandidates.map((candidate) => candidate.department)),
      experienceLevel: getUniqueValues(enrichedCandidates.map((candidate) => candidate.experienceLevel)),
      category: getUniqueValues(enrichedCandidates.map((candidate) => candidate.category)),
      availability: getUniqueValues(enrichedCandidates.map((candidate) => candidate.availability)),
      status: getUniqueValues(enrichedCandidates.map((candidate) => String(candidate.status))),
      verificationStatus: getUniqueValues(enrichedCandidates.map((candidate) => candidate.verificationStatus)),
    }),
    [enrichedCandidates],
  );

  const filteredCandidates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return enrichedCandidates.filter((candidate) => {
      const searchableText = [
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.role,
        candidate.skills.join(" "),
        candidate.department,
        candidate.experience,
        candidate.experienceLevel,
        candidate.category,
        candidate.availability,
        candidate.status,
        candidate.verificationStatus,
      ]
        .map(normalize)
        .join(" ");

      const matchesSearch = !query || searchableText.includes(query);
      const matchesFilters =
        (!appliedFilters.department || candidate.department === appliedFilters.department) &&
        (!appliedFilters.experienceLevel || candidate.experienceLevel === appliedFilters.experienceLevel) &&
        (!appliedFilters.category || candidate.category === appliedFilters.category) &&
        (!appliedFilters.availability || candidate.availability === appliedFilters.availability) &&
        (!appliedFilters.status || candidate.status === appliedFilters.status) &&
        (!appliedFilters.verificationStatus || candidate.verificationStatus === appliedFilters.verificationStatus);

      return matchesSearch && matchesFilters;
    });
  }, [appliedFilters, enrichedCandidates, searchTerm]);

  const departmentData = useMemo(() => {
    const counts = enrichedCandidates.reduce<Record<string, number>>((accumulator, candidate) => {
      accumulator[candidate.department] = (accumulator[candidate.department] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      percentage: formatPercent(value, enrichedCandidates.length),
    }));
  }, [enrichedCandidates]);

  const experienceData = useMemo(() => {
    const labels = ["Junior", "Mid-Level", "Lead / Director"];
    return labels.map((label) => {
      const value = filteredCandidates.filter((candidate) => candidate.experienceLevel === label).length;
      return {
        label: label === "Junior" ? "Junior (0-2 Years)" : label === "Mid-Level" ? "Mid-Level (3-6 Years)" : "Lead/Director (7+ Years)",
        value,
        percentage: formatPercent(value, filteredCandidates.length),
      };
    });
  }, [filteredCandidates]);

  const metricCards = useMemo(
    () => [
      {
        label: "Total Candidates",
        value: filteredCandidates.length.toLocaleString(),
        badge: `${formatPercent(filteredCandidates.length, enrichedCandidates.length)}%`,
        badgeClass: "ad-badge-blue",
        icon: <Users size={18} />,
      },
      {
        label: "New Applications",
        value: filteredCandidates.filter((candidate) => candidate.verificationStatus === "Profile Submitted").length.toLocaleString(),
        badge: "Live",
        badgeClass: "ad-badge-red",
        icon: <FileText size={18} />,
      },
      {
        label: "Actively Looking",
        value: filteredCandidates.filter((candidate) => candidate.availability === "Available").length.toLocaleString(),
        badge: "Now",
        badgeClass: "ad-badge-muted",
        icon: <CheckCircle2 size={18} />,
      },
      {
        label: "Pending Reviews",
        value: filteredCandidates.filter((candidate) => /pending|review/i.test(String(candidate.status))).length.toLocaleString(),
        badge: "Action Req.",
        badgeClass: "ad-badge-action",
        icon: <CalendarCheck size={18} />,
      },
      {
        label: "Open to Opportunities",
        value: filteredCandidates.filter((candidate) =>
          /open to opportunities/i.test([candidate.availability, candidate.status, candidate.verificationStatus].join(" ")),
        ).length.toLocaleString(),
        badge: "Firebase",
        badgeClass: "ad-badge-muted",
        icon: <CheckCircle2 size={18} />,
      },
    ],
    [enrichedCandidates.length, filteredCandidates],
  );

  const rows = filteredCandidates.slice(0, 8);
  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const updateDraftFilter = (field: keyof FilterState, value: string) => {
    setDraftFilters((current) => ({ ...current, [field]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsFiltersOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const markAllNotificationsRead = async () => {
    const unreadIds = notifications.filter((notification) => !notification.read).map((notification) => notification.id);
    setNotificationError("");
    try {
      await markNotificationsAsRead(unreadIds);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({ ...notification, read: true })),
      );
    } catch (markError) {
      setNotificationError(markError instanceof Error ? markError.message : "Unable to update Firebase notifications.");
    }
  };

  const openCandidateReview = (candidate: CandidateRecord) => {
    navigate(`/candidates/${candidate.id}`, { state: { candidate } });
  };

  return (
    <div className="ad-dashboard">
      <header className="ad-topbar">
        <h1>Dashboard Overview</h1>
        <div className="ad-user-actions">
          <div className="ad-notification-wrap">
            <button
              className="ad-icon-button ad-notification-btn"
              aria-label="Notifications"
              type="button"
              onClick={() => setIsNotificationsOpen((current) => !current)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="ad-unread-badge">{unreadCount}</span>}
            </button>
            {isNotificationsOpen && (
              <div className="ad-notification-menu">
                <div className="ad-menu-head">
                  <strong>Notifications</strong>
                  <button
                    type="button"
                    onClick={() => void markAllNotificationsRead()}
                  >
                    Mark all as read
                  </button>
                </div>
                {notificationError && (
                  <div className="ad-notification-item">
                    <span className="ad-alert-dot ad-alert-read" />
                    <p>{notificationError}</p>
                  </div>
                )}
                {!notificationError && notifications.length === 0 && (
                  <div className="ad-notification-item">
                    <span className="ad-alert-dot ad-alert-read" />
                    <p>No Firebase notifications yet.</p>
                  </div>
                )}
                {notifications.map((notification) => (
                  <div className="ad-notification-item" key={notification.id}>
                    <span className={notification.read ? "ad-alert-dot ad-alert-read" : "ad-alert-dot"} />
                    <p>{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="ad-divider" />
          <div className="ad-user">
            <span className="ad-user-avatar">AC</span>
            <strong>Alex Chen</strong>
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="ad-loading-state">
          Loading candidates from Firebase...
        </div>
      )}

      {error && (
        <div className="ad-error-state">
          <span>{error}</span>
          {onRetry && (
            <button type="button" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      )}

      <div className="ad-search-row">
        <div className="ad-search-field">
          <Search className="ad-search-icon" size={18} aria-hidden="true" />
          <input
            type="search"
            className="ad-search-input"
            placeholder="Global Candidate Search..."
            aria-label="Global candidate search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="ad-filter-wrap">
          <button
            type="button"
            className={`ad-filters-btn${activeFilterCount ? " ad-filters-active" : ""}`}
            onClick={() => setIsFiltersOpen((current) => !current)}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>
          {isFiltersOpen && (
            <div className="ad-filter-panel">
              <div className="ad-menu-head">
                <strong>Filters</strong>
                <button type="button" onClick={() => setIsFiltersOpen(false)} aria-label="Close filters">
                  <X size={16} />
                </button>
              </div>
              <FilterSelect label="Department" value={draftFilters.department} options={filterOptions.department} onChange={(value) => updateDraftFilter("department", value)} />
              <FilterSelect label="Experience Level" value={draftFilters.experienceLevel} options={filterOptions.experienceLevel} onChange={(value) => updateDraftFilter("experienceLevel", value)} />
              <FilterSelect label="Category" value={draftFilters.category} options={filterOptions.category} onChange={(value) => updateDraftFilter("category", value)} />
              <FilterSelect label="Availability" value={draftFilters.availability} options={filterOptions.availability} onChange={(value) => updateDraftFilter("availability", value)} />
              <FilterSelect label="Status" value={draftFilters.status} options={filterOptions.status} onChange={(value) => updateDraftFilter("status", value)} />
              <FilterSelect label="Verification Status" value={draftFilters.verificationStatus} options={filterOptions.verificationStatus} onChange={(value) => updateDraftFilter("verificationStatus", value)} />
              <div className="ad-filter-actions">
                <button type="button" className="ad-filter-reset" onClick={resetFilters}>
                  Reset Filter
                </button>
                <button type="button" className="ad-filter-apply" onClick={applyFilters}>
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>
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
            <div className="ad-donut" role="img" aria-label="Department distribution">
              <div className="ad-donut-inner">
                <strong>100%</strong>
                <span>Talent Pool</span>
              </div>
            </div>
            <div className="ad-legend">
              {departmentData.map((department) => (
                <div className="ad-legend-row" key={department.label}>
                  <span className="ad-legend-name">
                    <span className="ad-dot" />
                    {department.label}
                  </span>
                  <strong>{department.percentage}%</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ad-card ad-experience-card">
          <div className="ad-card-head">
            <h2 className="ad-card-title">Experience Categories</h2>
            <span>Candidate count / trend</span>
          </div>
          <div className="ad-bars">
            {experienceData.map((band) => (
              <div key={band.label} className="ad-bar-row">
                <div className="ad-bar-label">{band.label}</div>
                <div className="ad-bar-track" aria-label={`${band.label}: ${band.percentage}%`}>
                  <div className="ad-bar-fill" style={{ width: `${band.percentage}%` }} />
                </div>
                <div className="ad-bar-meta">
                  <strong>{band.value}</strong>
                  <span>{band.percentage}% of results</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ad-pipeline" aria-label="Talent availability pipeline">
        <div className="ad-pipeline-header">
          <div>
            <h2>Talent Availability Pipeline</h2>
            <p>{filteredCandidates.length} matching candidates</p>
          </div>
          <a href="/candidates">View All Records</a>
        </div>

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Category</th>
                <th>Availability</th>
                <th>Verification Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="ad-empty">
                    No candidates found. Try changing the search text or resetting filters.
                  </td>
                </tr>
              ) : (
                rows.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>
                      <button type="button" className="ad-cand-cell ad-cand-link" onClick={() => openCandidateReview(candidate)}>
                        <span className="ad-cand-av" style={{ background: avatarColors[index % avatarColors.length] }}>
                          {candidate.initials}
                        </span>
                        <span>
                          <span className="ad-cand-name">{candidate.name}</span>
                          <span className="ad-cand-role">{candidate.role}</span>
                        </span>
                      </button>
                    </td>
                    <td>{candidate.category}</td>
                    <td>{candidate.availability}</td>
                    <td>
                      <span className={`ad-status ad-status-${index}`}>
                        {candidate.verificationStatus}
                      </span>
                    </td>
                    <td>{candidate.lastActiveLabel}</td>
                    <td>
                      <button type="button" className="ad-review-btn" onClick={() => openCandidateReview(candidate)}>
                        Review Profile
                      </button>
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

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const FilterSelect = ({ label, value, options, onChange }: FilterSelectProps) => (
  <label className="ad-filter-field">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">All</option>
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default AdminDashboard;
