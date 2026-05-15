import React from 'react';
import HiringMetrics from '../../components/admin/Outcomes/HiringMetrics';
import './AdminPages.css';

const OutcomePage: React.FC = () => {
  return (
    <div className="outcome-page">
      <h1>Hiring Outcomes & Metrics</h1>
      <p className="page-description">
        Track hiring outcomes and view comprehensive analytics about your hiring process.
      </p>

      <div className="outcome-sections">
        <section className="outcome-section">
          <HiringMetrics />
        </section>
      </div>
    </div>
  );
};

export default OutcomePage;
