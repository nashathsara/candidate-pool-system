import React from 'react';
import './TicketSuccess.css';

interface TeamMember {
  name: string;
  avatar: string;
}

interface ResolutionStep {
  title: string;
  description: string;
  status: 'complete' | 'in-progress' | 'pending';
}

const TicketSuccess: React.FC = () => {
  const ticketId = '#TKT-2024-8471';
  const expectedResolution = '24-48 hours';
  
  const teamMembers: TeamMember[] = [
    { name: 'John Doe', avatar: '👤' },
    { name: 'Jane Smith', avatar: '👤' },
    { name: 'Mike Johnson', avatar: '👤' },
  ];

  const resolutionSteps: ResolutionStep[] = [
    {
      title: 'Ticket Submitted',
      description: 'Your request has been received and logged',
      status: 'complete',
    },
    {
      title: 'Under Review',
      description: 'Our team is analyzing your profile information',
      status: 'in-progress',
    },
    {
      title: 'Duplicate Verification',
      description: 'Identifying any conflicting duplicate profiles',
      status: 'pending',
    },
    {
      title: 'Resolution',
      description: 'Final action taken and notification sent',
      status: 'pending',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="badge badge-complete">Completed</span>;
      case 'in-progress':
        return <span className="badge badge-in-progress">In Progress</span>;
      case 'pending':
        return <span className="badge badge-pending">Pending</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <div className="status-icon icon-complete">✓</div>;
      case 'in-progress':
        return <div className="status-icon icon-in-progress">⟳</div>;
      case 'pending':
        return <div className="status-icon icon-pending">○</div>;
      default:
        return null;
    }
  };

  return (
    <div className="ticket-success-container">
      {/* Success Header */}
      <div className="success-header">
        <div className="checkmark-icon">✓</div>
        <h1>Ticket Successfully Created!</h1>
        <p>Your duplicate profile support request has been submitted and our team will review it shortly.</p>
      </div>

      {/* Main Card */}
      <div className="ticket-card">
        <div className="ticket-top">
          <div className="ticket-pill">Support Ticket</div>
          <h2 className="ticket-title">We received your request</h2>
          <p className="ticket-subtitle">
            Your duplicate profile support request was successfully submitted. You can track the status below.
          </p>
        </div>

        {/* Ticket Info Grid */}
        <div className="ticket-info-grid">
          <div className="ticket-info-item">
            <label>Ticket ID</label>
            <div className="ticket-id">
              <span>{ticketId}</span>
              <button className="copy-btn" title="Copy ticket ID" type="button">📋</button>
            </div>
            <div className="ticket-meta">Keep this ID for future updates.</div>
          </div>
          <div className="ticket-info-item">
            <label>Expected Resolution</label>
            <div className="resolution-time">
              <span className="resolution-badge">{expectedResolution}</span>
            </div>
            <div className="ticket-meta">Typically within 1–2 business days.</div>
          </div>
        </div>




        {/* Support Team Section */}
        <div className="support-team-section">
          <h3>Assigned Support Team</h3>
          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-avatar" title={member.name}>
                {member.avatar}
              </div>
            ))}
          </div>
          <p className="team-description">Dedicated support team assigned to your case</p>
        </div>

        {/* Resolution Timeline */}
        <div className="resolution-timeline">
          <h3>Resolution Timeline</h3>
          <div className="timeline-steps">
            {resolutionSteps.map((step, index) => (
              <div key={index} className={`timeline-step ${step.status}`}>
                <div className="step-icon-wrapper">
                  {getStatusIcon(step.status)}
                  {index < resolutionSteps.length - 1 && <div className="step-connector"></div>}
                </div>
                <div className="step-content">
                  <div className="step-header">
                    <h4>{step.title}</h4>
                    {getStatusBadge(step.status)}
                  </div>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Box */}
        <div className="warning-box">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4>What happens next?</h4>
            <p>We'll review email notifications at each stage of the process. Our team will contact you if additional information is needed to resolve your duplicate profile issue.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary">
            📊 Track Ticket Status
          </button>
          <button className="btn btn-secondary">
            ← Return to Dashboard
          </button>
        </div>

        {/* Additional Link */}
        <div className="additional-link">
          <a href="#submit-another">+ Submit Another Request</a>
        </div>
      </div>

      {/* Footer */}
      <div className="ticket-footer">
        <p>Need more assistance?</p>
        <div className="footer-links">
          <a href="#contact-support">📞 Contact Support</a>
          <span className="separator">•</span>
          <a href="#help-center">❓ Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default TicketSuccess;