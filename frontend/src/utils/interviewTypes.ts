// Interview Management Types
export interface Interview {
  id: string;
  candidateId: string;
  scheduledBy: string;
  scheduledByName: string;
  stage: 'phone_screen' | 'technical' | 'round_1' | 'round_2' | 'round_3' | 'final' | 'offer';
  scheduledDate: Date;
  duration: number; // in minutes
  interviewer: string;
  interviewerName: string;
  location?: string;
  meetingLink?: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  interviewId: string;
  technicalScore?: number;
  communicationScore?: number;
  cultureFitScore?: number;
  overallScore: number;
  feedbackText: string;
  recommendedForNextRound: boolean;
  interviewerName: string;
  timestamp: Date;
}

export interface InterviewStage {
  id: string;
  name: string;
  order: number;
  description: string;
}

export interface CandidateInterviewTrack {
  candidateId: string;
  currentStage: string;
  interviews: Interview[];
  passedStages: string[];
  failedStages?: string[];
}
