import React, { useState, useEffect } from 'react';
import { ReviewResponse, ReviewType } from '../../api/reviewApi';
import reviewApi from '../../api/reviewApi';
import ReviewItem from './ReviewItem';
import Pagination from '../common/Pagination';

interface ReviewListProps {
  targetId: number;
  targetType: ReviewType;
  pageSize?: number;
}

const ReviewList: React.FC<ReviewListProps> = ({
  targetId,
  targetType,
  pageSize = 5
}) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [targetId, targetType, currentPage, pageSize]);

  const fetchReviews = async (page: number) => {
    setLoading(true);
    try {
      const response = await reviewApi.getPublicReviewsByTarget(
        targetId,
        targetType,
        page,
        pageSize
      );
      setReviews(response.content);
      setTotalPages(response.totalPages);
      setTotalReviews(response.totalElements);
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading && reviews.length === 0) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Reviews ({totalReviews})</h3>
      <div>
        {reviews.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ReviewList; 