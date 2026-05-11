import { Link } from "react-router-dom";
import { CandidateStatusBadge } from "../../components/candidate/CandidateStatusBadge/CandidateStatusBadge";
import { useCandidates } from "../../hooks/useCandidates";
import "./Candidates.css";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16.5 16.5 3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M4 5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 19h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M12 17V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="m8 13 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg">
    <path d="M15 17h-6m3-14a3 3 0 0 0-3 3v1.28a5.5 5.5 0 0 1-2.25 4.47L6 14h12l-1.75-1.25A5.5 5.5 0 0 1 15 7.28V6a3 3 0 0 0-3-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 19a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon-svg profile-icon-svg">
    <circle cx="12" cy="7" r="3" fill="currentColor" />
    <path d="M5 20c0-4 3-7 7-7s7 3 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const Candidates = () => {
  const { candidates, totalDisplay } = useCandidates();

  return (
    <div className="candidates-page">
      <div className="page-top">
        <div className="title-section">
          <h1>Candidates</h1>
          <span className="total-badge">{totalDisplay} Total</span>
        </div>
        <div className="header-icons">
          <button type="button" className="icon-btn" aria-label="Notifications">
            <BellIcon />
          </button>
          <button type="button" className="icon-btn profile-btn" aria-label="Account">
            <ProfileIcon />
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box-wrapper">
          <span className="search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or keywords..."
            className="search-input"
          />
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-pills">
          <span className="filter-pill">
            Skill: React.js <span className="remove">×</span>
          </span>
          <span className="filter-pill">
            Experience: Senior (5+ yrs) <span className="remove">×</span>
          </span>
          <span className="filter-pill">
            Status: In Review <span className="remove">×</span>
          </span>
          <button type="button" className="clear-btn">
            Clear All
          </button>
        </div>
        <div className="action-buttons">
          <button type="button" className="btn btn-secondary">
            <span className="btn-icon">
              <FilterIcon />
            </span>
            Filters
          </button>
          <button type="button" className="btn btn-secondary">
            <span className="btn-icon">
              <DownloadIcon />
            </span>
            Export
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Primary Skills</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="name-cell">
                  <div className="candidate-badge">{candidate.initials}</div>
                  <div className="candidate-info">
                    <div className="candidate-name">{candidate.name}</div>
                    <div className="candidate-email">{candidate.email}</div>
                  </div>
                </td>
                <td className="skills-cell">
                  <div className="skill-tags">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                    {candidate.extraSkillsCount !== undefined &&
                    candidate.extraSkillsCount > 0 ? (
                      <span className="skill-tag extra">
                        +{candidate.extraSkillsCount}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td>{candidate.location}</td>
                <td>{candidate.experience}</td>
                <td>
                  <CandidateStatusBadge status={candidate.status} />
                </td>
                <td className="action-cell">
                  <Link to={`/candidates/${candidate.id}`} className="action-btn">
                    Review Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-section">
        <span className="pagination-info">
          Showing 1 to {candidates.length} of {totalDisplay} candidates
        </span>
        <div className="pagination-controls">
          <button type="button" className="pagination-btn prev">
            ‹
          </button>
          <button type="button" className="pagination-btn active">
            1
          </button>
          <button type="button" className="pagination-btn next">
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
