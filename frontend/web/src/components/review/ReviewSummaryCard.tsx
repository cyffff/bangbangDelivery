import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { ReviewType, ReviewSummary } from '../../api/reviewApi';
import reviewApi from '../../api/reviewApi';

interface ReviewSummaryCardProps {
  targetId: number;
  targetType: ReviewType;
}

const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({
  targetId,
  targetType
}) => {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, [targetId, targetType]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await reviewApi.getReviewSummary(targetId, targetType);
      setSummary(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching review summary:', error);
      setError('Failed to load review summary');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading summary...</div>;
  }

  if (error || !summary) {
    return null;
  }

  // Calculate percentages for the rating bars
  const calculatePercentage = (count: number) => {
    if (summary.totalReviews === 0) return 0;
    return (count / summary.totalReviews) * 100;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - average rating */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="text-3xl font-bold mb-2">{summary.averageRating.toFixed(1)}</div>
          <StarRating rating={Math.round(summary.averageRating)} readOnly />
          <div className="text-sm text-gray-600 mt-2">
            {summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Right side - rating breakdown */}
        <div className="w-full md:w-2/3">
          <div className="mb-1 flex items-center">
            <span className="w-16 text-sm">5 stars</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2">
              <div 
                className="h-3 bg-green-500 rounded-full" 
                style={{ width: `${calculatePercentage(summary.fiveStarCount)}%` }}
              ></div>
            </div>
            <span className="w-10 text-sm text-gray-600">{summary.fiveStarCount}</span>
          </div>

          <div className="mb-1 flex items-center">
            <span className="w-16 text-sm">4 stars</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2">
              <div 
                className="h-3 bg-green-400 rounded-full" 
                style={{ width: `${calculatePercentage(summary.fourStarCount)}%` }}
              ></div>
            </div>
            <span className="w-10 text-sm text-gray-600">{summary.fourStarCount}</span>
          </div>

          <div className="mb-1 flex items-center">
            <span className="w-16 text-sm">3 stars</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2">
              <div 
                className="h-3 bg-yellow-400 rounded-full" 
                style={{ width: `${calculatePercentage(summary.threeStarCount)}%` }}
              ></div>
            </div>
            <span className="w-10 text-sm text-gray-600">{summary.threeStarCount}</span>
          </div>

          <div className="mb-1 flex items-center">
            <span className="w-16 text-sm">2 stars</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2">
              <div 
                className="h-3 bg-orange-400 rounded-full" 
                style={{ width: `${calculatePercentage(summary.twoStarCount)}%` }}
              ></div>
            </div>
            <span className="w-10 text-sm text-gray-600">{summary.twoStarCount}</span>
          </div>

          <div className="mb-1 flex items-center">
            <span className="w-16 text-sm">1 star</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2">
              <div 
                className="h-3 bg-red-500 rounded-full" 
                style={{ width: `${calculatePercentage(summary.oneStarCount)}%` }}
              ></div>
            </div>
            <span className="w-10 text-sm text-gray-600">{summary.oneStarCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummaryCard; 