import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Download,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  Star,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useCandidates } from "../../hooks/useCandidates";
import {
  getCandidateResumeDownloadUrl,
  hasCandidateResume,
} from "../../services/firebaseAdminService";
import type { CandidateRecord, VerificationStatus } from "../../utils/candidateTypes";
import "./CandidateDetails.css";

const statusActions: Array<{
  label: string;
  status: VerificationStatus;
  icon: ReactNode;
  tone: "dark" | "blue" | "green" | "red" | "muted";
}> = [
  { label: "Withdraw", status: "Withdrawn", icon: <XCircle size={16} />, tone: "red" },
  { label: "Viewed by Admin", status: "Viewed by Admin", icon: <UserCheck size={16} />, tone: "blue" },
  { label: "Under Admin Review", status: "Under Admin Review", icon: <Briefcase size={16} />, tone: "dark" },
  { label: "Shortlist", status: "Shortlisted", icon: <Star size={16} />, tone: "green" },
  { label: "Reject", status: "Rejected", icon: <XCircle size={16} />, tone: "red" },
  { label: "In Review", status: "In Review", icon: <Briefcase size={16} />, tone: "muted" },
];

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
  candidate.activelyLooking || candidate.status === "In Review" ? "Available now" : "Open to future roles";

const getLinkedInUrl = (candidate: CandidateRecord) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(candidate.name)}`;

const CandidateDetails = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const { fetchById, updateCandidateStatus } = useCandidates();
  const [candidate, setCandidate] = useState<CandidateRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResumeOpening, setIsResumeOpening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resumeMessage, setResumeMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCandidate = async () => {
      if (!candidateId) {
        setErrorMessage("Candidate ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      try {
        const firebaseCandidate = await fetchById(candidateId);
        if (isMounted) {
          setCandidate(firebaseCandidate);
          if (!firebaseCandidate) {
            setErrorMessage("Candidate not found in Firebase.");
          }
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load candidate from Firebase.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCandidate();

    return () => {
      isMounted = false;
    };
  }, [candidateId, fetchById]);

  const timeline = useMemo(() => {
    if (!candidate) {
      return [];
    }

    return [
      {
        title: "Profile opened for review",
        detail: `${candidate.name} is being reviewed by the admin team.`,
        time: "Just now",
      },
      {
        title: candidate.verificationStatus,
        detail: "Latest verification state recorded in the candidate pipeline.",
        time: candidate.lastActiveLabel,
      },
      {
        title: "Profile submitted",
        detail: `${candidate.role} profile entered the ${candidate.category} talent pool.`,
        time: "Earlier",
      },
    ];
  }, [candidate]);

  const handleStatusUpdate = async (nextStatus: VerificationStatus) => {
    if (!candidateId) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    try {
      const updatedCandidate = await updateCandidateStatus(candidateId, nextStatus);
      if (updatedCandidate) {
        setCandidate(updatedCandidate);
      }
      setSuccessMessage(`Status updated to ${nextStatus}.`);
      window.setTimeout(() => setSuccessMessage(""), 2600);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Firebase status update failed.");
    }
  };

  const handleResumeDownload = async () => {
    if (!candidate) {
      return;
    }

    setResumeMessage("");
    setErrorMessage("");

    if (!hasCandidateResume(candidate)) {
      setResumeMessage("No resume uploaded for this candidate.");
      return;
    }

    setIsResumeOpening(true);
    try {
      const resumeUrl = await getCandidateResumeDownloadUrl(candidate);
      if (!resumeUrl) {
        setResumeMessage("No resume uploaded for this candidate.");
        return;
      }

      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to open candidate resume.");
    } finally {
      setIsResumeOpening(false);
    }
  };

  if (isLoading) {
    return (
      <div className="review-page">
        <section className="review-empty">
          <p>Loading candidate profile from Firebase...</p>
        </section>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="review-page">
        <section className="review-empty">
          <h1>Candidate not found</h1>
          <p>{errorMessage || "The selected profile could not be loaded."}</p>
          <Link to="/dashboard">Back to Dashboard</Link>
        </section>
      </div>
    );
  }

  const linkedinUrl = getLinkedInUrl(candidate);
  const resumeAvailable = hasCandidateResume(candidate);
  const resumeUnavailableMessage = "No resume uploaded for this candidate.";

  return (
    <div className="review-page">
      <header className="review-header">
        <button type="button" className="review-back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>
        <div className="review-header-actions">
          <a className="review-ghost-btn" href={`mailto:${candidate.email}`}>
            <Mail size={16} />
            Email
          </a>
          <button
            type="button"
            className="review-primary-btn"
            disabled={!resumeAvailable || isResumeOpening}
            title={resumeAvailable ? "Open candidate resume" : resumeUnavailableMessage}
            onClick={() => void handleResumeDownload()}
          >
            <Download size={16} />
            {isResumeOpening ? "Opening..." : "Resume"}
          </button>
        </div>
      </header>

      {successMessage && (
        <div className="review-success" role="status">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="review-error" role="alert">
          {errorMessage}
        </div>
      )}

      {resumeMessage && (
        <div className="review-error" role="status">
          {resumeMessage}
        </div>
      )}

      <section className="review-hero">
        <div className="review-avatar">{candidate.initials}</div>
        <div className="review-hero-main">
          <p className="review-eyebrow">Candidate Profile Review</p>
          <h1>{candidate.name}</h1>
          <p>{candidate.role}</p>
          <div className="review-hero-tags">
            <span>{candidate.category}</span>
            <span>{candidate.experience}</span>
            <span>{getAvailability(candidate)}</span>
          </div>
        </div>
        <div className="review-status-card">
          <span>Current Status</span>
          <strong>{candidate.verificationStatus}</strong>
        </div>
      </section>

      <main className="review-grid">
        <section className="review-card review-details-card">
          <div className="review-card-head">
            <h2>Candidate Details</h2>
            <span>{getDepartment(candidate)} department</span>
          </div>
          <div className="review-details-grid">
            <ReviewField label="Email" value={candidate.email} icon={<Mail size={16} />} />
            <ReviewField label="Phone" value={candidate.phone ?? "Not provided"} icon={<Phone size={16} />} />
            <ReviewField label="Category / Level" value={candidate.category} />
            <ReviewField label="Availability" value={getAvailability(candidate)} />
            <ReviewField label="Verification Status" value={candidate.verificationStatus} />
            <ReviewField label="Experience" value={candidate.experience} />
          </div>

          <div className="review-section">
            <h3>Skills</h3>
            <div className="review-skills">
              {candidate.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
              {candidate.extraSkillsCount ? <span>+{candidate.extraSkillsCount} more</span> : null}
            </div>
          </div>

          <div className="review-link-row">
            <a href={linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn Profile
              <ExternalLink size={15} />
            </a>
            <button
              type="button"
              id="resume"
              disabled={!resumeAvailable || isResumeOpening}
              title={resumeAvailable ? "Open candidate resume" : resumeUnavailableMessage}
              onClick={() => void handleResumeDownload()}
            >
              <Download size={15} />
              {isResumeOpening ? "Opening Resume..." : "Download CV / Resume"}
            </button>
          </div>
        </section>

        <aside className="review-card review-actions-card">
          <h2>Admin Actions</h2>
          <p>Choose the next verification state for this candidate.</p>
          <div className="review-action-list">
            {statusActions.map((action) => {
              const isCurrent = candidate.verificationStatus === action.status;
              return (
                <button
                  type="button"
                  key={action.status}
                  className={`review-action review-action-${action.tone}${isCurrent ? " review-action-current" : ""}`}
                  onClick={() => handleStatusUpdate(action.status)}
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {isCurrent && <strong>Current</strong>}
                </button>
              );
            })}
          </div>
          <button type="button" className="review-dashboard-btn" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </aside>

        <section className="review-card">
          <div className="review-card-head">
            <h2>Notes</h2>
            <MessageSquare size={18} />
          </div>
          <textarea
            className="review-notes"
            defaultValue={`Review ${candidate.name}'s ${candidate.category.toLowerCase()} profile for ${candidate.role} opportunities. Skills include ${candidate.skills.join(", ")}.`}
          />
        </section>

        <section className="review-card">
          <h2>Activity History</h2>
          <div className="review-timeline">
            {timeline.map((event) => (
              <div className="review-timeline-item" key={`${event.title}-${event.time}`}>
                <span />
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.detail}</p>
                  <small>{event.time}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const ReviewField = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) => (
  <div className="review-field">
    <span>
      {icon}
      {label}
    </span>
    <strong>{value}</strong>
  </div>
);

export default CandidateDetails;
