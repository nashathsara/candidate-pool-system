import { Link, useParams } from "react-router-dom";
import { CandidateProfile } from "../../components/candidate/CandidateProfile/CandidateProfile";
import { CandidateStatusBadge } from "../../components/candidate/CandidateStatusBadge/CandidateStatusBadge";
import { useCandidates } from "../../hooks/useCandidates";

const CandidateDetails = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { getById, updateCandidateStatus } = useCandidates();

  const candidate = candidateId ? getById(candidateId) : undefined;

  const handleStatusUpdate = (
    nextStatus: "Viewed by Admin" | "Under Admin Review" | "Withdrawn"
  ) => {
    if (!candidateId) return;
    updateCandidateStatus(candidateId, nextStatus);
  };

  if (!candidate) {
    return (
      <div className="ad-dashboard" style={{ paddingTop: 32 }}>
        <div className="ad-card">
          <p style={{ margin: 0, color: "#6b7280" }}>Candidate not found.</p>
          <Link
            to="/candidates"
            style={{ marginTop: 16, display: "inline-block", color: "#2563eb" }}
          >
            ← Back to candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-dashboard" style={{ paddingTop: 20 }}>
      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <Link
          to="/candidates"
          style={{ fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}
        >
          ← Candidates
        </Link>
        <span style={{ color: "#d1d5db" }}>|</span>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Admin review</h1>
        <CandidateStatusBadge status={candidate.verificationStatus} />
      </div>

      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button
          type="button"
          className="ad-review-btn"
          style={{ background: "#059669" }}
          onClick={() => handleStatusUpdate("Viewed by Admin")}
        >
          Update Status
        </button>
        <button
          type="button"
          className="ad-filters-btn"
          onClick={() => handleStatusUpdate("Under Admin Review")}
        >
          Request changes
        </button>
        <button
          type="button"
          className="ad-filters-btn"
          onClick={() => handleStatusUpdate("Withdrawn")}
        >
          Flag duplicate
        </button>
      </div>

      <CandidateProfile candidate={candidate} showAdminMeta />
    </div>
  );
};

export default CandidateDetails;
