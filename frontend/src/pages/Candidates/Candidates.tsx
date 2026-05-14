import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./Candidates.css";

type CandidateStatusColor = "blue" | "gray" | "red";

type Candidate = {
  id: string;
  initials: string;
  name: string;
  email: string;
  skills: string[];
  extraSkills: string;
  location: string;
  experience: string;
  status: string;
  statusColor: CandidateStatusColor;
  cvData?: any;
  applicationId?: string;
  interestedField?: string;
  availability?: string;
  phone?: string;
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

const getInitials = (name: string): string => {
  if (!name) return "?";
  const names = name.split(" ");
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + (names[names.length - 1][0] || "")).toUpperCase();
};

const getStatusColor = (status: string): CandidateStatusColor => {
  const statusLower = status.toLowerCase();
  if (statusLower === "in review" || statusLower === "actively looking") {
    return "blue";
  }
  if (statusLower === "new" || statusLower === "open to opportunities") {
    return "gray";
  }
  if (statusLower === "withdrawn" || statusLower === "pending") {
    return "red";
  }
  return "gray";
};

const getExperienceLevel = (years: number): string => {
  if (years === 0) return "Fresher";
  if (years <= 2) return `${years} Years (Junior)`;
  if (years <= 5) return `${years} Years (Mid-Level)`;
  if (years <= 8) return `${years} Years (Senior)`;
  return `${years} Years (Expert)`;
};

const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const candidatesCollection = collection(db, "candidates");
      const candidatesQuery = query(
        candidatesCollection,
        orderBy("createdAt", "desc"),
        limit(50)
      );
      
      const querySnapshot = await getDocs(candidatesQuery);
      const candidatesData: Candidate[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const experienceYears = data.experienceYears || 0;
        
        candidatesData.push({
          id: doc.id,
          initials: getInitials(data.fullName || ""),
          name: data.fullName || "Unknown",
          email: data.email || "",
          skills: data.skills || [],
          extraSkills: "",
          location: data.location || "Remote",
          experience: getExperienceLevel(experienceYears),
          status: data.status || "New",
          statusColor: getStatusColor(data.status || "New"),
          cvData: data.cvData,
          applicationId: data.applicationId,
          interestedField: data.interestedField,
          availability: data.availability,
          phone: data.phone,
        });
      });
      
      setCandidates(candidatesData);
      setTotalCount(candidatesData.length);
      
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to load candidates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchTerm === "" || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || 
      candidate.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleReviewProfile = (candidateId: string) => {
    navigate(`/candidate-profile/${candidateId}`);
  };

  const handleViewCV = (candidate: Candidate) => {
    if (candidate.cvData && candidate.cvData.content) {
      const win = window.open();
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${candidate.name} - CV</title>
            <style>
              body { margin: 0; padding: 0; height: 100vh; overflow: hidden; }
              embed { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <embed src="${candidate.cvData.content}" type="application/pdf" width="100%" height="100%" />
          </body>
          </html>
        `);
        win.document.close();
      }
    } else {
      alert("No CV available for this candidate");
    }
  };

  const handleDownloadCV = (candidate: Candidate) => {
    if (candidate.cvData && candidate.cvData.content) {
      const link = document.createElement("a");
      link.href = candidate.cvData.content;
      link.download = candidate.cvData.fileName || `${candidate.name}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No CV available for download");
    }
  };

  if (loading) {
    return (
      <div className="candidates-page">
        <div className="loading-container" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          fontSize: "18px",
          color: "#666"
        }}>
          Loading candidates...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidates-page">
        <div className="error-container" style={{
          padding: "20px",
          backgroundColor: "#fee",
          color: "#c00",
          borderRadius: "8px",
          margin: "20px",
          textAlign: "center"
        }}>
          {error}
          <button 
            onClick={fetchCandidates}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidates-page">
      <div className="page-top">
        <div className="title-section">
          <h1>Candidates</h1>
          <span className="total-badge">{totalCount} Total</span>
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
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-pills">
          {filterStatus !== "all" && (
            <span className="filter-pill">
              Status: {filterStatus} <span className="remove" onClick={() => setFilterStatus("all")}>×</span>
            </span>
          )}
          {searchTerm && (
            <span className="filter-pill">
              Search: {searchTerm} <span className="remove" onClick={() => setSearchTerm("")}>×</span>
            </span>
          )}
          {(filterStatus !== "all" || searchTerm) && (
            <button className="clear-btn" onClick={() => {
              setFilterStatus("all");
              setSearchTerm("");
            }}>Clear All</button>
          )}
        </div>
        <div className="action-buttons">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="actively looking">Actively Looking</option>
            <option value="open to opportunities">Open to Opportunities</option>
            <option value="in review">In Review</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
          </select>
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
              <th>Location & Availability</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="name-cell">
                    <div className="candidate-badge">{candidate.initials}</div>
                    <div className="candidate-info">
                      <div className="candidate-name">{candidate.name}</div>
                      <div className="candidate-email">{candidate.email}</div>
                      {candidate.phone && (
                        <div className="candidate-phone">{candidate.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="skills-cell">
                    <div className="skill-tags">
                      {candidate.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="skill-tag extra">+{candidate.skills.length - 3}</span>
                      )}
                    </div>
                    {candidate.interestedField && (
                      <div className="interested-field">
                        {candidate.interestedField.split("/")[0]}
                      </div>
                    )}
                  </td>
                  <td>
                    <div>{candidate.location}</div>
                    {candidate.availability && (
                      <div className="availability-info">
                        Available: {candidate.availability}
                      </div>
                    )}
                  </td>
                  <td>{candidate.experience}</td>
                  <td>
                    <span className={`status-badge status-${candidate.statusColor}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button 
                      className="action-btn"
                      onClick={() => handleReviewProfile(candidate.id)}
                    >
                      Review Profile
                    </button>
                    <button 
                      className="action-btn-secondary"
                      onClick={() => handleDownloadCV(candidate)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                  No candidates found
                </td>
              </tr>

            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-section">
        <span className="pagination-info">
          Showing {filteredCandidates.length} of {totalCount} candidates
        </span>
      </div>
    </div>
  );
};

export default Candidates;