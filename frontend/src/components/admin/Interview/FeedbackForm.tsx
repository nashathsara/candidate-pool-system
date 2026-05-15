import React, { useState } from 'react';
import { addInterviewFeedback, markStagePassed, markStageFailed } from '../../../services/interviewService';
import type { Interview, InterviewFeedback } from '../../../utils/interviewTypes';
import './InterviewManagement.css';

interface FeedbackFormProps {
  interview: Interview;
  onFeedbackSubmitted: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  interview,
  onFeedbackSubmitted,
}) => {
  const [feedbackData, setFeedbackData] = useState({
    technicalScore: 3,
    communicationScore: 3,
    cultureFitScore: 3,
    overallScore: 3,
    feedbackText: '',
    recommendedForNextRound: false,
  });

  const handleSubmitFeedback = async () => {
    if (!feedbackData.feedbackText.trim()) {
      alert('Please add feedback');
      return;
    }

    try {
      const feedback: Omit<InterviewFeedback, 'timestamp'> = {
        interviewId: interview.id,
        technicalScore: feedbackData.technicalScore,
        communicationScore: feedbackData.communicationScore,
        cultureFitScore: feedbackData.cultureFitScore,
        overallScore: feedbackData.overallScore,
        feedbackText: feedbackData.feedbackText,
        recommendedForNextRound: feedbackData.recommendedForNextRound,
        interviewerName: interview.interviewerName || 'Unknown',
      };

      await addInterviewFeedback(interview.id, feedback);

      // Mark stage based on recommendation
      if (feedbackData.recommendedForNextRound) {
        await markStagePassed(interview.candidateId, interview.stage);
      } else {
        await markStageFailed(interview.candidateId, interview.stage);
      }

      alert('Feedback submitted successfully!');
      setFeedbackData({
        technicalScore: 3,
        communicationScore: 3,
        cultureFitScore: 3,
        overallScore: 3,
        feedbackText: '',
        recommendedForNextRound: false,
      });
      onFeedbackSubmitted();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const renderScoreSelector = (label: string, score: number, onChange: (value: number) => void) => (
    <div className="score-selector">
      <label>{label}</label>
      <div className="score-buttons">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            className={`score-btn ${score === s ? 'selected' : ''}`}
            onClick={() => onChange(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="feedback-form">
      <h3>Interview Feedback</h3>
      
      <div className="interview-info">
        <p>
          <strong>Stage:</strong> {interview.stage.replace(/_/g, ' ')}
        </p>
        <p>
          <strong>Interviewer:</strong> {interview.interviewerName || interview.interviewer}
        </p>
        <p>
          <strong>Date:</strong> {new Date(interview.scheduledDate).toLocaleString()}
        </p>
      </div>

      <div className="feedback-form-content">
        {renderScoreSelector(
          'Technical Skills (1-5)',
          feedbackData.technicalScore,
          (value) => setFeedbackData({ ...feedbackData, technicalScore: value })
        )}

        {renderScoreSelector(
          'Communication (1-5)',
          feedbackData.communicationScore,
          (value) => setFeedbackData({ ...feedbackData, communicationScore: value })
        )}

        {renderScoreSelector(
          'Cultural Fit (1-5)',
          feedbackData.cultureFitScore,
          (value) => setFeedbackData({ ...feedbackData, cultureFitScore: value })
        )}

        {renderScoreSelector(
          'Overall Score (1-5)',
          feedbackData.overallScore,
          (value) => setFeedbackData({ ...feedbackData, overallScore: value })
        )}

        <div className="form-group">
          <label>Detailed Feedback *</label>
          <textarea
            placeholder="Provide detailed feedback about the candidate..."
            value={feedbackData.feedbackText}
            onChange={(e) =>
              setFeedbackData({ ...feedbackData, feedbackText: e.target.value })
            }
            rows={5}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={feedbackData.recommendedForNextRound}
              onChange={(e) =>
                setFeedbackData({
                  ...feedbackData,
                  recommendedForNextRound: e.target.checked,
                })
              }
            />
            Recommend for next round
          </label>
        </div>

        <button className="btn-submit-feedback" onClick={handleSubmitFeedback}>
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
