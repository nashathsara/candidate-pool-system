// src/components/CandidateSubmission.tsx
import React, { useState } from 'react';
import CVUpload from './CVUpload';

// Type definitions
interface Candidate {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  appliedRole: string;
}

const CandidateSubmission: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const handleSuccess = (candidate: Candidate): void => {
    setSuccessMessage(`Candidate ${candidate.fullName} submitted successfully!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };
  
  return (
    <div className="container mx-auto p-4">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}
      
      <CVUpload onSuccess={handleSuccess} />
    </div>
  );
};

export default CandidateSubmission;