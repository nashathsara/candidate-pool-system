export type CandidateStatus =
  | "New"
  | "In Review"
  | "Pending Review"
  | "Profile Updated"
  | "Actively Looking"
  | "Archived";

export type DuplicateCaseStatus = "pending" | "kept-separate" | "merged";

export type CandidateExperience = {
  role: string;
  company: string;
  employmentType: string;
  period: string;
  summary: string;
};

export type CandidateEducation = {
  degree: string;
  institution: string;
  graduated: string;
};

export type CandidateReviewScores = {
  technical: number;
  communication: number;
  culture: number;
};

export type CandidateProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  bio: string;
  department: string;
  yearsExperience: number;
  skills: string[];
  status: CandidateStatus;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  duplicateStatus: "none" | "potential" | "resolved";
  duplicateCaseId?: string;
  reviewScores: CandidateReviewScores;
  experience: CandidateExperience[];
  education: CandidateEducation[];
  userId?: string;
};

export type CandidateFormValues = Pick<
  CandidateProfile,
  | "fullName"
  | "email"
  | "phone"
  | "location"
  | "title"
  | "bio"
  | "department"
  | "yearsExperience"
  | "skills"
  | "visibility"
>;

export type DuplicateCase = {
  id: string;
  candidateId: string;
  matchedCandidateId: string;
  status: DuplicateCaseStatus;
  confidence: number;
  reasons: string[];
  createdAt: string;
  updatedAt: string;
  candidateSnapshot: CandidateProfile;
  matchedCandidateSnapshot: CandidateProfile;
};

export type DashboardMetricCard = {
  label: string;
  value: number;
  changeLabel: string;
};

export type DashboardSnapshot = {
  metrics: DashboardMetricCard[];
  departmentBreakdown: Array<{ label: string; value: number; percentage: number }>;
  experienceBreakdown: Array<{ label: string; value: number; percentage: number }>;
  recentCandidates: CandidateProfile[];
  pendingDuplicates: DuplicateCase[];
};
