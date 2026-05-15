import React, { useState, useEffect } from 'react';
import { getInterviewsForCandidate, cancelInterview } from '../../../services/interviewService';
import type { Interview } from '../../../utils/interviewTypes';
import './InterviewManagement.css';

interface InterviewTrackerProps {
  candidateId: string;
  onInterviewsLoad?: (interviews: Interview[]) => void;
}

const InterviewTracker: React.FC<InterviewTrackerProps> = ({
  candidateId,
  onInterviewsLoad,
}) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, [candidateId]);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const fetchedInterviews = await getInterviewsForCandidate(candidateId);
      const sorted = fetchedInterviews.sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      );
      setInterviews(sorted);
      onInterviewsLoad?.(sorted);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInterview = async (interviewId: string) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;

    try {
      await cancelInterview(interviewId);
      loadInterviews();
    } catch (error) {
      console.error('Failed to cancel interview:', error);
    }
  };

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      case 'no_show':
        return '#ff9800';
      default:
        return '#999';
    }
  };

  if (loading) {
    return <div className="interview-tracker-loading">Loading interviews...</div>;
  }

  const upcomingInterviews = interviews.filter(
    (i) =>
      i.status === 'scheduled' &&
      new Date(i.scheduledDate) > new Date()
  );
  const pastInterviews = interviews.filter(
    (i) =>
      i.status !== 'scheduled' ||
      new Date(i.scheduledDate) <= new Date()
  );

  return (
    <div className="interview-tracker">
      <h3>Interview History</h3>

      {upcomingInterviews.length > 0 && (
        <div className="upcoming-interviews">
          <h4>📅 Upcoming Interviews ({upcomingInterviews.length})</h4>
          {upcomingInterviews.map((interview) => (
            <div key={interview.id} className="interview-card upcoming">
              <div className="interview-card-header">
                <span className="interview-stage">{interview.stage.replace(/_/g, ' ')}</span>
                <span className="interview-status" style={{ color: getStatusColor(interview.status) }}>
                  {interview.status}
                </span>
              </div>
              <div className="interview-details">
                <p>
                  <strong>📅 Date:</strong>{' '}
                  {new Date(interview.scheduledDate).toLocaleString()}
                </p>
                <p>
                  <strong>⏱️ Duration:</strong> {interview.duration} minutes
                </p>
                <p>
                  <strong>👤 Interviewer:</strong> {interview.interviewerName || interview.interviewer}
                </p>
                {interview.location && (
                  <p>
                    <strong>📍 Location:</strong> {interview.location}
                  </p>
                )}
                {interview.meetingLink && (
                  <p>
                    <strong>🔗 Meeting:</strong>{' '}
                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </p>
                )}
                {interview.description && (
                  <p>
                    <strong>📝 Notes:</strong> {interview.description}
                  </p>
                )}
              </div>
              <div className="interview-actions">
                <button
                  className="btn-cancel-interview"
                  onClick={() => handleCancelInterview(interview.id)}
                >
                  Cancel Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pastInterviews.length > 0 && (
        <div className="past-interviews">
          <h4>📋 Interview History ({pastInterviews.length})</h4>
          {pastInterviews.map((interview) => (
            <div
              key={interview.id}
              className={`interview-card past interview-${interview.status}`}
            >
              <div className="interview-card-header">
                <span className="interview-stage">{interview.stage.replace(/_/g, ' ')}</span>
                <span className="interview-status" style={{ color: getStatusColor(interview.status) }}>
                  {interview.status}
                </span>
              </div>
              <div className="interview-details">
                <p>
                  <strong>📅 Date:</strong>{' '}
                  {new Date(interview.scheduledDate).toLocaleString()}
                </p>
                <p>
                  <strong>👤 Interviewer:</strong> {interview.interviewerName || interview.interviewer}
                </p>
                {interview.feedback && (
                  <div className="interview-feedback">
                    <strong>📊 Feedback:</strong>
                    <p>{interview.feedback.feedbackText}</p>
                    <p>
                      Overall Score: {interview.feedback.overallScore}/5
                    </p>
                    {interview.feedback.recommendedForNextRound && (
                      <p className="recommended">✅ Recommended for next round</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {interviews.length === 0 && (
        <p className="no-interviews">No interviews scheduled yet.</p>
      )}
    </div>
  );
};

export default InterviewTracker;
