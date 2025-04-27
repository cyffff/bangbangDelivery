import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import StarRating from './StarRating';
import { ReviewResponse } from '../../api/reviewApi';

interface ReviewItemProps {
  review: ReviewResponse;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm mb-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center">
            <StarRating rating={review.rating} size={18} readOnly />
            <span className="ml-2 text-gray-700 font-semibold">{review.rating}/5</span>
          </div>
          <h4 className="text-lg font-medium mt-1">{review.reviewerName}</h4>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(review.createdAt)}
        </div>
      </div>
      
      {review.comment && (
        <div className="mt-3 text-gray-700">
          {review.comment}
        </div>
      )}
      
      {!review.isApproved && (
        <div className="mt-2 text-sm text-amber-600 italic">
          Pending approval
        </div>
      )}
    </div>
  );
};

export default ReviewItem; 