export type ListStatusTone = "blue" | "gray" | "red";

export type VerificationStatus =
  | "Pending Review"
  | "Profile Submitted"
  | "Under Admin Review"
  | "Viewed by Admin"
  | "Not Yet Reviewed"
  | "In Review"
  | "New"
  | "Withdrawn"
  | "Shortlisted"
  | "Rejected"
  | "Contacted";

export interface CandidateRecord {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  /** Shown when more than displayed skills */
  extraSkillsCount?: number;
  location: string;
  experience: string;
  /** Table status (mock) */
  status: VerificationStatus | string;
  statusTone: ListStatusTone;
  category: "Junior" | "Mid-Level" | "Lead / Director";
  verificationStatus: VerificationStatus;
  lastActiveLabel: string;
  phone?: string;
  availability?: string;
  activelyLooking?: boolean;
}
