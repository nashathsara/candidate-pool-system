import React, { useState } from 'react';
import CommentThread from './CommentThread';
import RatingComponent from './RatingComponent';
import './CollaborationPanel.css';

interface CollaborationPanelProps {
  candidateId: string;
  currentUserId: string;
  currentUserName: string;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  candidateId,
  currentUserId,
  currentUserName,
}) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'ratings'>('comments');

  return (
    <div className="collaboration-panel">
      <div className="collaboration-tabs">
        <button
          className={`collaboration-tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          💬 Comments
        </button>
        <button
          className={`collaboration-tab ${activeTab === 'ratings' ? 'active' : ''}`}
          onClick={() => setActiveTab('ratings')}
        >
          ⭐ Ratings
        </button>
      </div>

      <div className="collaboration-content">
        {activeTab === 'comments' && (
          <CommentThread
            candidateId={candidateId}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />
        )}
        {activeTab === 'ratings' && (
          <RatingComponent
            candidateId={candidateId}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;
