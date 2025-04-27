import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
  onClick?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 24,
  color = '#FFD700',
  onClick,
  readOnly = false
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (readOnly || !onClick) return;
    onClick(index);
  };

  const renderStar = (index: number) => {
    const starNumber = index + 1;
    const filled = starNumber <= (hoverRating || rating);

    const starStyle = {
      cursor: readOnly ? 'default' : 'pointer',
      color,
      fontSize: `${size}px`,
      marginRight: '2px'
    };

    if (filled) {
      return (
        <FaStar
          style={starStyle}
          key={`star-${index}`}
          onMouseEnter={() => handleMouseEnter(starNumber)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starNumber)}
        />
      );
    }

    return (
      <FaRegStar
        style={starStyle}
        key={`star-${index}`}
        onMouseEnter={() => handleMouseEnter(starNumber)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(starNumber)}
      />
    );
  };

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => renderStar(index))}
    </div>
  );
};

export default StarRating; 