import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiFilter, FiSearch } from "react-icons/fi";
import { useCandidates } from "../../hooks/useCandidates";
import "./Candidates.css";

const Candidates = () => {
  const navigate = useNavigate();
  const { candidates, error, isLoading, reloadCandidates } = useCandidates();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return candidates;

    return candidates.filter((candidate) =>
      [
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.role,
        candidate.skills.join(" "),
        candidate.location,
        candidate.experience,
        candidate.category,
        candidate.status,
        candidate.verificationStatus,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [candidates, searchTerm]);

  return (
    <div className="candidates-page">
      <div className="page-top">
        <div className="title-section">
          <h1>Candidates</h1>
          <span className="total-badge">{filteredCandidates.length.toLocaleString()} Total</span>
        </div>
        <div className="header-icons">
          <button className="icon-btn" type="button" aria-label="Notifications">
            <FiBell />
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box-wrapper">
          <span className="search-icon">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, phone, role, or skills..."
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="mb-4 rounded border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          Loading candidates from Firebase...
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          <span>{error}</span>
          <button type="button" className="clear-btn" onClick={() => void reloadCandidates()}>
            Retry
          </button>
        </div>
      )}

      <div className="filters-section">
        <div className="filter-pills">
          <span className="filter-pill">Firebase source</span>
          {searchTerm && (
            <button type="button" className="clear-btn" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          )}
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary" type="button">
            <span className="btn-icon"><FiFilter /></span>
            Filters
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
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="action-cell">
                  No Firebase candidates found.
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="name-cell">
                    <div className="candidate-badge">{candidate.initials}</div>
                    <div className="candidate-info">
                      <button
                        type="button"
                        className="candidate-name"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                      >
                        {candidate.name}
                      </button>
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
                      {candidate.skills.length > 3 && (
                        <span className="skill-tag extra">+{candidate.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>{candidate.location || "Not provided"}</td>
                  <td>{candidate.experience}</td>
                  <td>
                    <span className={`status-badge status-${candidate.statusTone}`}>
                      {candidate.verificationStatus}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="action-btn"
                      type="button"
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      Review Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-section">
        <span className="pagination-info">
          Showing {filteredCandidates.length ? 1 : 0} to {filteredCandidates.length} of {filteredCandidates.length} candidates
        </span>
      </div>
    </div>
  );
};

export default Candidates;
