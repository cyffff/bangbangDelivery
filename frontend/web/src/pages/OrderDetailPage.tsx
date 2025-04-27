import React from 'react';
import { Row, Col } from 'antd';
import OrderDetail from '../components/order/OrderDetail';

const OrderDetailPage: React.FC = () => {
  return (
    <div className="order-detail-page">
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <OrderDetail />
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage; 