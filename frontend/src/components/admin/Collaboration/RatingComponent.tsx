import React, { useState, useEffect } from 'react';
import { addRating, getRatings, getAverageRating } from '../../../services/collaborationService';
import type { CandidateRating } from '../../../utils/collaborationTypes';
import './CollaborationPanel.css';

interface RatingComponentProps {
  candidateId: string;
  currentUserId: string;
  currentUserName: string;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  candidateId,
  currentUserId,
  currentUserName,
}) => {
  const [ratings, setRatings] = useState<CandidateRating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<
    'overall' | 'technical' | 'communication' | 'fit'
  >('overall');
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'overall' as const, label: 'Overall Fit' },
    { value: 'technical' as const, label: 'Technical Skills' },
    { value: 'communication' as const, label: 'Communication' },
    { value: 'fit' as const, label: 'Cultural Fit' },
  ];

  useEffect(() => {
    loadRatings();
  }, [candidateId]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const fetchedRatings = await getRatings(candidateId);
      const avgRating = await getAverageRating(candidateId);
      setRatings(fetchedRatings);
      setAverageRating(avgRating);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) return;

    try {
      await addRating(candidateId, {
        candidateId,
        raterId: currentUserId,
        raterName: currentUserName,
        rating: selectedRating,
        category: selectedCategory,
        comment: ratingComment || undefined,
      });
      setSelectedRating(0);
      setRatingComment('');
      loadRatings();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= count ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="rating-component-loading">Loading ratings...</div>;
  }

  return (
    <div className="rating-component">
      <div className="rating-header">
        <h3>Candidate Rating</h3>
        <div className="average-rating">
          <span className="rating-value">{averageRating.toFixed(1)}</span>
          <span className="rating-stars">{renderStars(Math.round(averageRating))}</span>
          <span className="rating-count">({ratings.length} ratings)</span>
        </div>
      </div>

      <div className="rating-form">
        <div className="rating-category-select">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value as 'overall' | 'technical' | 'communication' | 'fit'
              )
            }
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rating-input">
          <label>Your Rating:</label>
          <div className="star-picker">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${star <= selectedRating ? 'selected' : ''}`}
                onClick={() => setSelectedRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="rating-comment-input">
          <textarea
            placeholder="Add a comment (optional)"
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            rows={2}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSubmitRating}
          disabled={selectedRating === 0}
        >
          Submit Rating
        </button>
      </div>

      <div className="ratings-list">
        <h4>All Ratings</h4>
        {ratings.length === 0 ? (
          <p className="no-ratings">No ratings yet.</p>
        ) : (
          ratings.map((rating, index) => (
            <div key={index} className="rating-item">
              <div className="rating-item-header">
                <strong>{rating.raterName}</strong>
                <span className="rating-category-badge">{rating.category}</span>
              </div>
              <div className="rating-item-content">
                <div className="rating-item-stars">
                  {renderStars(rating.rating)}
                </div>
                {rating.comment && (
                  <p className="rating-item-comment">{rating.comment}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingComponent;
