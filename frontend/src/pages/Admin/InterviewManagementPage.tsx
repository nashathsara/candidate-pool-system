import React from 'react';
import InterviewScheduler from '../../components/admin/Interview/InterviewScheduler';
import InterviewTracker from '../../components/admin/Interview/InterviewTracker';
import { useAuth } from '../../hooks/useAuth';

interface InterviewManagementPageProps {
  candidateId?: string;
  candidateName?: string;
}

const InterviewManagementPage: React.FC<InterviewManagementPageProps> = ({
  candidateId,
  candidateName,
}) => {
  const { user } = useAuth();

  if (!candidateId || !candidateName || !user) {
    return <div className="page-error">Invalid candidate or user information</div>;
  }

  const handleInterviewScheduled = () => {
    // Trigger refresh in InterviewTracker
    window.location.reload();
  };

  return (
    <div className="interview-management-page">
      <h1>Interview Management</h1>

      <div className="interview-page-container">
        <div className="interview-schedule-section">
          <InterviewScheduler
            candidateId={candidateId}
            candidateName={candidateName}
            currentUserId={user.uid}
            currentUserName={user.displayName || user.email || 'Admin'}
            onInterviewScheduled={handleInterviewScheduled}
          />
        </div>

        <div className="interview-tracker-section">
          <InterviewTracker candidateId={candidateId} />
        </div>
      </div>
    </div>
  );
};

export default InterviewManagementPage;
