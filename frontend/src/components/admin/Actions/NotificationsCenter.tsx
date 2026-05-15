import React, { useState, useEffect } from 'react';
import { getNotifications, updateNotificationStatus } from '../../../services/automationService';
import type { NotificationAction } from '../../../utils/automationTypes';
import './NotificationsCenter.css';

interface NotificationsCenterProps {
  userId: string;
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<NotificationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'sent' | 'failed'>('all');

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const fetchedNotifications = await getNotifications(userId, 100);
      setNotifications(
        fetchedNotifications.sort((a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        )
      );
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateNotificationStatus(notificationId, 'sent');
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleRetry = async (notificationId: string) => {
    try {
      await updateNotificationStatus(notificationId, 'pending');
      loadNotifications();
    } catch (error) {
      console.error('Failed to retry:', error);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filterStatus === 'all') return true;
    return notif.status === filterStatus;
  });

  const pendingCount = notifications.filter((n) => n.status === 'pending').length;

  if (loading) {
    return <div className="notifications-loading">Loading notifications...</div>;
  }

  return (
    <div className="notifications-center">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {pendingCount > 0 && (
          <span className="pending-badge">{pendingCount} pending</span>
        )}
      </div>

      <div className="notifications-filter">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending ({notifications.filter((n) => n.status === 'pending').length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'sent' ? 'active' : ''}`}
          onClick={() => setFilterStatus('sent')}
        >
          Sent ({notifications.filter((n) => n.status === 'sent').length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('failed')}
        >
          Failed ({notifications.filter((n) => n.status === 'failed').length})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item notification-${notif.status}`}
            >
              <div className="notification-content">
                <div className="notification-header-row">
                  <h4>{notif.title}</h4>
                  <span className={`status-badge status-${notif.status}`}>
                    {notif.status}
                  </span>
                </div>
                <p className="notification-message">{notif.message}</p>
                <div className="notification-meta">
                  <span className="notification-type">
                    📧 {notif.type === 'email' ? 'Email' : notif.type === 'reminder' ? '🔔 Reminder' : '💬 In-app'}
                  </span>
                  <span className="notification-time">
                    {new Date(notif.createdDate).toLocaleString()}
                  </span>
                </div>
                {notif.failureReason && (
                  <p className="failure-reason">⚠️ {notif.failureReason}</p>
                )}
              </div>
              <div className="notification-actions">
                {notif.status === 'pending' && (
                  <button
                    className="btn-mark-sent"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    Mark Sent
                  </button>
                )}
                {notif.status === 'failed' && (
                  <button
                    className="btn-retry"
                    onClick={() => handleRetry(notif.id)}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsCenter;
