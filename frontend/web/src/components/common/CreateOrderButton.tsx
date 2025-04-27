import React from 'react';
import { Button, message, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../store/slices/authSlice';

interface CreateOrderButtonProps {
  demandId?: number;
  journeyId?: number;
  demanderId?: number;
  travelerId?: number;
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CreateOrderButton: React.FC<CreateOrderButtonProps> = ({
  demandId,
  journeyId,
  demanderId,
  travelerId,
  buttonText = 'Create Order',
  className,
  style
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  const handleCreateOrder = () => {
    if (!isAuthenticated) {
      notification.info({
        message: 'Login Required',
        description: 'Please login to create an order',
        btn: <Button type="primary" size="small" onClick={() => navigate('/login')}>Login</Button>,
      });
      return;
    }
    
    // Check if we have the minimum required info to create an order
    if (!demandId && !journeyId) {
      message.error('Either a demand or journey must be specified to create an order');
      return;
    }
    
    // Determine demander and traveler IDs if not provided
    const finalDemanderId = demanderId || currentUser?.id;
    const finalTravelerId = travelerId || currentUser?.id;
    
    if (!finalDemanderId || !finalTravelerId) {
      message.error('Could not determine the demander or traveler for this order');
      return;
    }
    
    // Navigate to create order page with prefilled data
    navigate('/orders/create', {
      state: {
        demandId,
        journeyId,
        demanderId: finalDemanderId,
        travelerId: finalTravelerId
      }
    });
  };
  
  return (
    <Button
      type="primary"
      icon={<ShoppingCartOutlined />}
      onClick={handleCreateOrder}
      className={className}
      style={style}
    >
      {buttonText}
    </Button>
  );
};

export default CreateOrderButton; 