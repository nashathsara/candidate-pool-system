// src/firestore/schemas.js
// Define your Firestore collections structure

/*
Collection: candidates
Document: {autoId}
{
  id: string,
  fullName: string,
  email: string,
  phone: string,
  appliedRole: string,
  status: 'pending' | 'review' | 'hired' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp,
  cvData: {
    // Extracted data from CV
    fileName: string,
    fileUrl: string,
    extractedText: string,
    skills: string[],
    experience: number, // years
    education: string[],
    previousCompanies: string[]
  },
  metadata: {
    source: 'manual' | 'ai_extraction' | 'upload',
    confidenceScore: number,
    duplicateCheckPerformed: boolean
  }
}

Collection: duplicate_tickets
Document: {autoId}
{
  ticketId: string, // e.g., "86291-D"
  primaryCandidateId: string, // reference to existing candidate
  duplicateCandidateId: string, // reference to new candidate
  confidenceScore: number, // 0-100
  matchFields: {
    email: boolean,
    phone: boolean,
    name: {
      matched: boolean,
      similarity: number
    }
  },
  status: 'pending' | 'merged' | 'separate' | 'info_requested',
  createdAt: timestamp,
  resolvedAt: timestamp,
  resolvedBy: string, // user id
  action: 'merge' | 'separate' | null,
  notes: string
}

Collection: candidates/{candidateId}/activities
Document: {autoId}
{
  action: string,
  timestamp: timestamp,
  userId: string,
  details: object
}
*/