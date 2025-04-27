import React from 'react';
import { Row, Col, Card } from 'antd';
import OrderList from '../components/order/OrderList';
import { useAuth } from '../contexts/AuthContext';

const OrderListPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="order-list-page">
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card title="My Orders" bordered={false}>
            {currentUser ? (
              <OrderList userId={currentUser.id} isForDemander={true} />
            ) : (
              <p>Please log in to view your orders.</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderListPage; 