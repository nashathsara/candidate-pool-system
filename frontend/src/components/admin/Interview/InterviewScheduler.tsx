import React, { useState } from 'react';
import { scheduleInterview } from '../../../services/interviewService';
import type { Interview } from '../../../utils/interviewTypes';
import './InterviewManagement.css';

interface InterviewSchedulerProps {
  candidateId: string;
  candidateName: string;
  currentUserId: string;
  currentUserName: string;
  onInterviewScheduled: () => void;
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  candidateId,
  candidateName,
  currentUserId,
  currentUserName,
  onInterviewScheduled,
}) => {
  const [formData, setFormData] = useState({
    stage: 'phone_screen',
    scheduledDate: '',
    scheduledTime: '',
    duration: 30,
    interviewer: '',
    interviewerName: '',
    location: '',
    meetingLink: '',
    description: '',
  });

  const stages = [
    { value: 'phone_screen', label: 'Phone Screen' },
    { value: 'technical', label: 'Technical Interview' },
    { value: 'round_1', label: 'Round 1' },
    { value: 'round_2', label: 'Round 2' },
    { value: 'round_3', label: 'Round 3' },
    { value: 'final', label: 'Final Round' },
    { value: 'offer', label: 'Offer Discussion' },
  ];

  const handleSchedule = async () => {
    if (!formData.scheduledDate || !formData.interviewer) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const dateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      await scheduleInterview({
        candidateId,
        scheduledBy: currentUserId,
        scheduledByName: currentUserName,
        stage: formData.stage as Interview['stage'],
        scheduledDate: dateTime,
        duration: formData.duration,
        interviewer: formData.interviewer,
        interviewerName: formData.interviewerName,
        location: formData.location || undefined,
        meetingLink: formData.meetingLink || undefined,
        description: formData.description || undefined,
      } as Omit<Interview, 'id'>);

      alert('Interview scheduled successfully!');
      setFormData({
        stage: 'phone_screen',
        scheduledDate: '',
        scheduledTime: '',
        duration: 30,
        interviewer: '',
        interviewerName: '',
        location: '',
        meetingLink: '',
        description: '',
      });
      onInterviewScheduled();
    } catch (error) {
      console.error('Failed to schedule interview:', error);
      alert('Failed to schedule interview');
    }
  };

  return (
    <div className="interview-scheduler">
      <h3>Schedule Interview</h3>
      
      <div className="candidate-info">
        <strong>{candidateName}</strong>
      </div>

      <div className="scheduler-form">
        <div className="form-row">
          <div className="form-group">
            <label>Interview Stage *</label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
            >
              {stages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              min="15"
              max="180"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Time *</label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) =>
                setFormData({ ...formData, scheduledTime: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Interviewer Email *</label>
            <input
              type="email"
              placeholder="interviewer@company.com"
              value={formData.interviewer}
              onChange={(e) =>
                setFormData({ ...formData, interviewer: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Interviewer Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.interviewerName}
              onChange={(e) =>
                setFormData({ ...formData, interviewerName: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location or Meeting Link</label>
          <input
            type="text"
            placeholder="e.g., Conference Room A or Zoom link"
            value={formData.location || formData.meetingLink}
            onChange={(e) => {
              const value = e.target.value;
              if (value.includes('http')) {
                setFormData({ ...formData, meetingLink: value, location: '' });
              } else {
                setFormData({ ...formData, location: value, meetingLink: '' });
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Any additional details about the interview"
            value={formData.description}
            onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            rows={3}
          />
        </div>

        <button className="btn-schedule" onClick={handleSchedule}>
          Schedule Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewScheduler;
