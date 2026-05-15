import React from 'react';
import ActionPanel from '../../components/admin/Actions/ActionPanel';
import AutoShortlistManager from '../../components/admin/Automation/AutoShortlistManager';
import { useAuth } from '../../hooks/useAuth';
import './AdminPages.css';

const AutomationPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="page-error">You must be logged in to view this page</div>;
  }

  return (
    <div className="automation-page">
      <h1>Automation & Actions</h1>
      <p className="page-description">
        Set up automated workflows, rules, and actions to streamline your hiring process.
      </p>

      <div className="automation-sections">
        <section className="automation-section">
          <ActionPanel userId={user.uid} />
        </section>

        <section className="automation-section">
          <AutoShortlistManager userId={user.uid} />
        </section>
      </div>
    </div>
  );
};

export default AutomationPage;
