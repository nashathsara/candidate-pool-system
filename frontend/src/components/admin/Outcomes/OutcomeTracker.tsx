import React, { useState, useEffect } from 'react';
import {
  getCandidateOutcome,
  updateCandidateStatus,
  markAsHired,
  markAsRejected,
  getCandidateTimeline,
} from '../../../services/outcomeService';
import type { CandidateOutcome, OutcomeTimeline } from '../../../utils/outcomeTypes';
import './OutcomeTracking.css';

interface OutcomeTrackerProps {
  candidateId: string;
  candidateName: string;
  currentUserId: string;
  currentUserName: string;
}

const OutcomeTracker: React.FC<OutcomeTrackerProps> = ({
  candidateId,
  candidateName,
  currentUserId,
  currentUserName,
}) => {
  const [outcome, setOutcome] = useState<CandidateOutcome | null>(null);
  const [timeline, setTimeline] = useState<OutcomeTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHireForm, setShowHireForm] = useState(false);
  const [hireData, setHireData] = useState({
    position: '',
    department: '',
    salary: 0,
    startDate: '',
  });

  useEffect(() => {
    loadOutcome();
  }, [candidateId]);

  const loadOutcome = async () => {
    try {
      setLoading(true);
      const outcomeData = await getCandidateOutcome(candidateId);
      const timelineData = await getCandidateTimeline(candidateId);
      
      setOutcome(outcomeData);
      setTimeline(timelineData.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Failed to load outcome:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!outcome) return;

    try {
      await updateCandidateStatus(
        candidateId,
        newStatus,
        newStatus,
        currentUserId,
        currentUserName,
        `Status updated to ${newStatus}`
      );
      loadOutcome();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleMarkAsHired = async () => {
    if (!hireData.position || !hireData.department || !hireData.startDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await markAsHired(
        candidateId,
        {
          position: hireData.position,
          department: hireData.department,
          salary: hireData.salary,
          startDate: new Date(hireData.startDate),
          hiringManagerName: currentUserName,
        },
        currentUserId,
        currentUserName
      );

      setHireData({
        position: '',
        department: '',
        salary: 0,
        startDate: '',
      });
      setShowHireForm(false);
      loadOutcome();
    } catch (error) {
      console.error('Failed to mark as hired:', error);
    }
  };

  const handleMarkAsRejected = async () => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await markAsRejected(candidateId, reason, currentUserId, currentUserName);
      loadOutcome();
    } catch (error) {
      console.error('Failed to mark as rejected:', error);
    }
  };

  if (loading) {
    return <div className="outcome-tracker-loading">Loading outcome data...</div>;
  }

  if (!outcome) {
    return <div className="no-outcome">No outcome data available.</div>;
  }

  const statusOptions = [
    'pipeline',
    'contacted',
    'interviewing',
    'offered',
    'hired',
    'rejected',
    'withdrawn',
  ];

  return (
    <div className="outcome-tracker">
      <h3>Outcome Tracking</h3>

      <div className="candidate-outcome-info">
        <p>
          <strong>Candidate:</strong> {candidateName}
        </p>
        <p>
          <strong>Current Status:</strong>{' '}
          <span className={`status-badge status-${outcome.status}`}>
            {outcome.status}
          </span>
        </p>
        <p>
          <strong>Current Stage:</strong> {outcome.currentStage}
        </p>
      </div>

      <div className="outcome-actions">
        <div className="action-group">
          <label>Update Status:</label>
          <select
            value={outcome.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {outcome.status !== 'hired' && (
          <button
            className="btn-mark-hired"
            onClick={() => setShowHireForm(!showHireForm)}
          >
            ✓ Mark as Hired
          </button>
        )}

        {outcome.status !== 'rejected' && (
          <button
            className="btn-mark-rejected"
            onClick={handleMarkAsRejected}
          >
            ✗ Mark as Rejected
          </button>
        )}
      </div>

      {showHireForm && (
        <div className="hire-form">
          <h4>Mark Candidate as Hired</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                value={hireData.position}
                onChange={(e) =>
                  setHireData({ ...hireData, position: e.target.value })
                }
                placeholder="e.g., Senior Developer"
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                value={hireData.department}
                onChange={(e) =>
                  setHireData({ ...hireData, department: e.target.value })
                }
                placeholder="e.g., Engineering"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary ($)</label>
              <input
                type="number"
                value={hireData.salary}
                onChange={(e) =>
                  setHireData({ ...hireData, salary: parseInt(e.target.value) })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={hireData.startDate}
                onChange={(e) =>
                  setHireData({ ...hireData, startDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="hire-form-actions">
            <button className="btn-save" onClick={handleMarkAsHired}>
              Confirm Hire
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowHireForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {outcome.status === 'hired' && (
        <div className="hired-info">
          <h4>✓ Hired</h4>
          <p>
            <strong>Position:</strong> {outcome.position}
          </p>
          <p>
            <strong>Department:</strong> {outcome.department}
          </p>
          {outcome.salary && (
            <p>
              <strong>Salary:</strong> ${outcome.salary.toLocaleString()}
            </p>
          )}
          {outcome.startDate && (
            <p>
              <strong>Start Date:</strong>{' '}
              {new Date(outcome.startDate).toLocaleDateString()}
            </p>
          )}
          {outcome.hiringManagerName && (
            <p>
              <strong>Hiring Manager:</strong> {outcome.hiringManagerName}
            </p>
          )}
        </div>
      )}

      {outcome.status === 'rejected' && (
        <div className="rejected-info">
          <h4>✗ Rejected</h4>
          <p>
            <strong>Reason:</strong> {outcome.decisionReason}
          </p>
          {outcome.decisionDate && (
            <p>
              <strong>Date:</strong> {new Date(outcome.decisionDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {timeline.length > 0 && (
        <div className="timeline-section">
          <h4>Timeline</h4>
          <div className="timeline">
            {timeline.map((entry) => (
              <div key={entry.id} className="timeline-entry">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-status">{entry.status}</span>
                    <span className="timeline-date">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {entry.notes && <p className="timeline-notes">{entry.notes}</p>}
                  <p className="timeline-updatedby">
                    Updated by {entry.updatedByName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutcomeTracker;
