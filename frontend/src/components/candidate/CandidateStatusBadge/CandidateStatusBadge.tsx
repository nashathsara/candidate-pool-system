import type { VerificationStatus } from "../../../utils/candidateTypes";
import "./CandidateStatusBadge.css";

/** Maps list + verification labels to pill styles aligned with admin mockups */
function badgeClass(status: VerificationStatus | string): string {
  const s = String(status);
  if (s === "Pending Review" || s === "Not Yet Reviewed") return "csb-gray";
  if (s === "Profile Submitted" || s === "New") return "csb-green";
  if (s === "Under Admin Review") return "csb-navy";
  if (s === "Viewed by Admin") return "csb-sky";
  if (s === "In Review") return "csb-blue";
  if (s === "Withdrawn") return "csb-red";
  return "csb-muted";
}

export interface CandidateStatusBadgeProps {
  status: VerificationStatus | string;
}

export function CandidateStatusBadge({ status }: CandidateStatusBadgeProps) {
  return (
    <span className={`csb-pill ${badgeClass(status)}`}>{status}</span>
  );
}
