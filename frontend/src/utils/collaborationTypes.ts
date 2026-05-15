// Collaboration & Notes Types
export interface Comment {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  timestamp: Date;
  taggedUsers: string[];
  resolved: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
  avatar?: string;
}

export interface CandidateRating {
  candidateId: string;
  raterId: string;
  raterName: string;
  rating: number; // 1-5
  category: 'overall' | 'technical' | 'communication' | 'fit';
  comment?: string;
  timestamp: Date;
}

export interface Collaboration {
  candidateId: string;
  comments: Comment[];
  ratings: CandidateRating[];
  teamMembers: TeamMember[];
  lastUpdated: Date;
}
