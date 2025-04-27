import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StarRating from './StarRating';
import reviewApi, { ReviewRequest, ReviewType } from '../../api/reviewApi';
import { toast } from 'react-toastify';

interface ReviewFormProps {
  targetId: number;
  targetType: ReviewType;
  orderId?: number;
  journeyId?: number;
  demandId?: number;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  targetId,
  targetType,
  orderId,
  journeyId,
  demandId,
  onSuccess
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (currentUser?.id) {
      // Check if user has already reviewed this target
      reviewApi.hasReviewed(currentUser.id, targetId, targetType)
        .then(result => {
          setHasReviewed(result);
        })
        .catch(error => {
          console.error('Error checking review status:', error);
          // If there's an error, assume user hasn't reviewed yet
          setHasReviewed(false);
        });
    }
  }, [currentUser?.id, targetId, targetType]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.id) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    const reviewRequest: ReviewRequest = {
      reviewerId: currentUser.id,
      targetId,
      type: targetType,
      rating,
      comment: comment.trim() || undefined,
      isPublic,
      orderId,
      journeyId,
      demandId
    };
    
    try {
      await reviewApi.createReview(reviewRequest);
      toast.success('Your review has been submitted');
      setRating(0);
      setComment('');
      setHasReviewed(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (hasReviewed) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
        <p className="text-gray-700">You have already submitted a review for this {targetType.toLowerCase()}.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <StarRating rating={rating} onClick={handleRatingChange} />
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
          />
        </div>
        
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">Make review public</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 