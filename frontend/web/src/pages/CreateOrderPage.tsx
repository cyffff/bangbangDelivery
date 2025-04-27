import React from 'react';
import { Row, Col } from 'antd';
import OrderForm from '../components/order/OrderForm';
import { orderApi } from '../api/orderApi';
import { OrderRequest } from '../types/Order';

const CreateOrderPage: React.FC = () => {
  const handleSubmit = async (values: OrderRequest) => {
    await orderApi.createOrder(values);
  };

  return (
    <div className="create-order-page">
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <OrderForm
            title="Create New Order"
            submitButtonText="Create Order"
            onSubmit={handleSubmit}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CreateOrderPage; 