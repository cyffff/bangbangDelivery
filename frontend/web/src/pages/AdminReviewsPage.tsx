import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import reviewApi, { ReviewResponse } from '../api/reviewApi';
import StarRating from '../components/review/StarRating';
import { formatDistanceToNow } from 'date-fns';

const AdminReviewsPage: React.FC = () => {
  const [pendingReviews, setPendingReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-admin users
    if (currentUser && !currentUser.roles.includes('ROLE_ADMIN')) {
      navigate('/');
      return;
    }

    fetchPendingReviews();
  }, [currentUser, navigate]);

  const fetchPendingReviews = async () => {
    setLoading(true);
    try {
      const reviews = await reviewApi.getReviewsPendingApproval();
      setPendingReviews(reviews);
      setError(null);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      setError('Failed to load pending reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      await reviewApi.approveReview(reviewId);
      // Remove the approved review from the list
      setPendingReviews(pendingReviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review. Please try again.');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await reviewApi.deleteReview(reviewId);
      // Remove the deleted review from the list
      setPendingReviews(pendingReviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Review Management</h1>
        <div className="text-center py-8">Loading pending reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Review Management</h1>
        <div className="text-center py-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Review Management</h1>
      
      <div className="mb-4 bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700">
          {pendingReviews.length} {pendingReviews.length === 1 ? 'review' : 'reviews'} pending approval
        </p>
      </div>

      {pendingReviews.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews pending approval.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingReviews.map(review => (
                <tr key={review.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{review.reviewerName}</div>
                    <div className="text-sm text-gray-500">ID: {review.reviewerId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{review.targetName}</div>
                    <div className="text-sm text-gray-500">{review.type} #{review.targetId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={review.rating} size={16} readOnly />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {review.comment || '(No comment)'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage; 