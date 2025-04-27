import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import ReviewSummaryCard from '../components/review/ReviewSummaryCard';
import { ReviewType } from '../api/reviewApi';

const ReviewsPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [reviewType, setReviewType] = useState<ReviewType>(ReviewType.USER);
  const [targetId, setTargetId] = useState<number>(0);
  const [title, setTitle] = useState<string>('Reviews');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!type || !id) {
      navigate('/not-found');
      return;
    }

    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      navigate('/not-found');
      return;
    }

    setTargetId(idNum);

    // Map URL parameter to ReviewType
    switch (type.toUpperCase()) {
      case 'USER':
        setReviewType(ReviewType.USER);
        setTitle('User Reviews');
        break;
      case 'ORDER':
        setReviewType(ReviewType.ORDER);
        setTitle('Order Reviews');
        break;
      case 'JOURNEY':
        setReviewType(ReviewType.JOURNEY);
        setTitle('Journey Reviews');
        break;
      case 'DEMAND':
        setReviewType(ReviewType.DEMAND);
        setTitle('Demand Reviews');
        break;
      default:
        navigate('/not-found');
        return;
    }
  }, [type, id, navigate]);

  const handleReviewSuccess = () => {
    // Refresh reviews list
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">
          ID: {targetId}
        </p>
      </div>

      <div className="mb-8">
        <ReviewSummaryCard targetId={targetId} targetType={reviewType} />
      </div>

      {currentUser && (
        <div className="mb-8">
          <ReviewForm 
            targetId={targetId} 
            targetType={reviewType} 
            onSuccess={handleReviewSuccess}
          />
        </div>
      )}

      <div>
        <ReviewList targetId={targetId} targetType={reviewType} pageSize={10} />
      </div>
    </div>
  );
};

export default ReviewsPage; 