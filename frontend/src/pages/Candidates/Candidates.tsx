import { useState } from "react";
import "./Candidates.css";

type CandidateStatusColor = "blue" | "gray" | "red";

type Candidate = {
  id: number;
  initials: string;
  name: string;
  email: string;
  skills: string[];
  extraSkills: string;
  location: string;
  experience: string;
  status: string;
  statusColor: CandidateStatusColor;
};

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
  const [candidates] = useState<Candidate[]>([
    {
      id: 1,
      initials: "EJ",
      name: "Shafin",
      email: "shafin@example.com",
      skills: ["React", "Node.js"],
      extraSkills: "+3",
      location: "Berlin, Germany",
      experience: "6 Years",
      status: "In Review",
      statusColor: "blue",
    },
    {
      id: 2,
      initials: "MK",
      name: "Thushainini",
      email: "thushai@example.com",
      skills: ["Python", "AWS"],
      extraSkills: "+2",
      location: "Austin, TX",
      experience: "8 Years",
      status: "New",
      statusColor: "gray",
    },
    {
      id: 3,
      initials: "SL",
      name: "Sarah",
      email: "sarah@design.co",
      skills: ["Figma", "UI/UX"],
      extraSkills: "",
      location: "London, UK",
      experience: "4 Years",
      status: "New",
      statusColor: "gray",
    },
    {
      id: 4,
      initials: "DR",
      name: "Heli",
      email: "heli@stream.com",
      skills: ["Go", "Kubernetes"],
      extraSkills: "+5",
      location: "Remote",
      experience: "10 Years",
      status: "Withdrawn",
      statusColor: "red",
    },
    {
      id: 5,
      initials: "AL",
      name: "Shavindi",
      email: "shavindi@creative.net",
      skills: ["Vue.js", "Tailwind"],
      extraSkills: "",
      location: "Singapore",
      experience: "3 Years",
      status: "In Review",
      statusColor: "blue",
    },
  ]);

  return (
    <div className="candidates-page">
      <div className="page-top">
        <div className="title-section">
          <h1>Candidates</h1>
          <span className="total-badge">1,248 Total</span>
        </div>
        <div className="header-icons">
          <button className="icon-btn">
            <BellIcon />
          </button>
          <button className="icon-btn profile-btn">
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
          <button className="clear-btn">Clear All</button>
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary">
            <span className="btn-icon"><FilterIcon /></span>
            Filters
          </button>
          <button className="btn btn-secondary">
            <span className="btn-icon"><DownloadIcon /></span>
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
                    {candidate.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                    {candidate.extraSkills && (
                      <span className="skill-tag extra">{candidate.extraSkills}</span>
                    )}
                  </div>
                </td>
                <td>{candidate.location}</td>
                <td>{candidate.experience}</td>
                <td>
                  <span className={`status-badge status-${candidate.statusColor}`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="action-btn">Review Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-section">
        <span className="pagination-info">Showing 1 to 5 of 1,248 candidates</span>
        <div className="pagination-controls">
          <button className="pagination-btn prev">‹</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <span className="pagination-dots">...</span>
          <button className="pagination-btn">250</button>
          <button className="pagination-btn next">›</button>
        </div>
      </div>
    </div>
  );
};

export default Candidates;

