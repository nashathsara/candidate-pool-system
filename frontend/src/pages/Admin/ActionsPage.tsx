import React from 'react';
import NotificationsCenter from '../../components/admin/Actions/NotificationsCenter';
import { useAuth } from '../../hooks/useAuth';
import './AdminPages.css';

const ActionsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="page-error">You must be logged in to view this page</div>;
  }

  return (
    <div className="actions-page">
      <h1>Notifications & Actions</h1>
      <p className="page-description">
        View all notifications and manage actions related to candidates and hiring process.
      </p>

      <div className="actions-sections">
        <section className="actions-section">
          <NotificationsCenter userId={user.uid} />
        </section>
      </div>
    </div>
  );
};

export default ActionsPage;
