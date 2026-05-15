// Outcome Tracking Types
export interface CandidateOutcome {
  candidateId: string;
  status: 'pipeline' | 'contacted' | 'interviewing' | 'offered' | 'hired' | 'rejected' | 'withdrawn';
  currentStage: string;
  finalDecision?: 'hired' | 'rejected' | 'withdrawn';
  decisionDate?: Date;
  decisionReason?: string;
  hiringManagerName?: string;
  hiringDate?: Date;
  position?: string;
  department?: string;
  salary?: number;
  startDate?: Date;
  timeline: OutcomeTimeline[];
}

export interface OutcomeTimeline {
  id: string;
  candidateId: string;
  status: string;
  stage: string;
  timestamp: Date;
  notes?: string;
  updatedBy: string;
  updatedByName: string;
}

export interface HiringMetrics {
  totalCandidatesProcessed: number;
  hired: number;
  rejected: number;
  withdrawn: number;
  currentlyInterviewing: number;
  averageTimeToHire: number; // in days
  offersPercentage: number;
  acceptanceRate: number;
  departmentBreakdown: Record<string, DepartmentMetrics>;
}

export interface DepartmentMetrics {
  department: string;
  totalCandidates: number;
  hired: number;
  rejected: number;
  avgTimeToHire: number;
}
