import React, { useState, useEffect } from 'react';
import {
  addComment,
  getComments,
  deleteComment,
} from '../../../services/collaborationService';
import type { Comment } from '../../../utils/collaborationTypes';
import './CollaborationPanel.css';

interface CommentThreadProps {
  candidateId: string;
  currentUserId: string;
  currentUserName: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  candidateId,
  currentUserId,
  currentUserName,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadComments();
  }, [candidateId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getComments(candidateId);
      setComments(fetchedComments.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(candidateId, {
        candidateId,
        authorId: currentUserId,
        authorName: currentUserName,
        authorEmail: currentUserId,
        content: newComment,
        taggedUsers,
        resolved: false,
      });
      setNewComment('');
      setTaggedUsers([]);
      loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(candidateId, commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) {
    return <div className="comment-thread-loading">Loading comments...</div>;
  }

  return (
    <div className="comment-thread">
      <div className="comment-thread-header">
        <h3>Comments & Notes</h3>
        <span className="comment-count">{comments.length}</span>
      </div>

      <div className="comment-input-container">
        <textarea
          className="comment-input"
          placeholder="Add a comment... Type @name to tag team members"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <div className="comment-input-actions">
          <button
            className="btn-secondary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </div>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Start a conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author-info">
                  <strong>{comment.authorName}</strong>
                  <span className="comment-time">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {comment.authorId === currentUserId && (
                  <button
                    className="btn-delete-comment"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="comment-content">{comment.content}</p>
              {comment.taggedUsers.length > 0 && (
                <div className="tagged-users">
                  Tagged: {comment.taggedUsers.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentThread;
