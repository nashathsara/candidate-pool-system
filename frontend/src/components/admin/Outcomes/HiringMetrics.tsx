import React, { useState, useEffect } from 'react';
import { getHiringMetrics } from '../../../services/outcomeService';
import type { HiringMetrics } from '../../../utils/outcomeTypes';
import './OutcomeTracking.css';

const HiringMetricsComponent: React.FC = () => {
  const [metrics, setMetrics] = useState<HiringMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const metricsData = await getHiringMetrics();
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load hiring metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="metrics-loading">Loading hiring metrics...</div>;
  }

  if (!metrics) {
    return <div className="no-metrics">No hiring metrics available.</div>;
  }

  const metricCards = [
    {
      title: 'Total Candidates',
      value: metrics.totalCandidatesProcessed,
      color: '#0066cc',
      icon: '👥',
    },
    {
      title: 'Hired',
      value: metrics.hired,
      color: '#4caf50',
      icon: '✓',
    },
    {
      title: 'Rejected',
      value: metrics.rejected,
      color: '#f44336',
      icon: '✗',
    },
    {
      title: 'Currently Interviewing',
      value: metrics.currentlyInterviewing,
      color: '#ff9800',
      icon: '📋',
    },
  ];

  return (
    <div className="hiring-metrics">
      <h3>Hiring Metrics & Analytics</h3>

      <div className="metrics-grid">
        {metricCards.map((card, index) => (
          <div key={index} className="metric-card" style={{ borderLeftColor: card.color }}>
            <div className="metric-icon">{card.icon}</div>
            <div className="metric-content">
              <p className="metric-title">{card.title}</p>
              <p className="metric-value" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="metrics-stats">
        <div className="stat-box">
          <h4>Offer Rate</h4>
          <p className="stat-value">{metrics.offersPercentage.toFixed(1)}%</p>
          <p className="stat-label">of candidates receive offers</p>
        </div>

        <div className="stat-box">
          <h4>Acceptance Rate</h4>
          <p className="stat-value">{metrics.acceptanceRate.toFixed(1)}%</p>
          <p className="stat-label">of offers are accepted</p>
        </div>

        <div className="stat-box">
          <h4>Avg Time to Hire</h4>
          <p className="stat-value">{metrics.averageTimeToHire}</p>
          <p className="stat-label">days</p>
        </div>
      </div>

      {Object.keys(metrics.departmentBreakdown).length > 0 && (
        <div className="department-breakdown">
          <h4>Department Breakdown</h4>
          <div className="departments-grid">
            {Object.values(metrics.departmentBreakdown).map((dept) => (
              <div key={dept.department} className="department-card">
                <h5>{dept.department}</h5>
                <div className="department-stats">
                  <p>
                    <strong>Total:</strong> {dept.totalCandidates}
                  </p>
                  <p>
                    <strong>Hired:</strong>{' '}
                    <span className="stat-hired">{dept.hired}</span>
                  </p>
                  <p>
                    <strong>Rejected:</strong>{' '}
                    <span className="stat-rejected">{dept.rejected}</span>
                  </p>
                  <p>
                    <strong>Avg Time:</strong> {dept.avgTimeToHire} days
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

export default HiringMetricsComponent;
