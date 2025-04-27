import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import OrderForm from '../components/order/OrderForm';
import { orderApi } from '../api/orderApi';
import { OrderRequest } from '../types/Order';

const EditOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<OrderRequest | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        navigate('/orders');
        return;
      }

      try {
        const order = await orderApi.getOrderById(parseInt(id, 10));
        
        // Extract only the fields needed for OrderRequest
        const orderRequest: OrderRequest = {
          demandId: order.demandId,
          journeyId: order.journeyId,
          demanderId: order.demanderId,
          travelerId: order.travelerId,
          itemName: order.itemName,
          description: order.description,
          pickupLocation: order.pickupLocation,
          deliveryLocation: order.deliveryLocation,
          expectedPickupDate: order.expectedPickupDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          weight: order.weight,
          volume: order.volume,
          price: order.price
        };
        
        setInitialValues(orderRequest);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        message.error('Failed to load order details. Please try again later.');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleSubmit = async (values: OrderRequest) => {
    if (!id) return;
    
    await orderApi.updateOrder(parseInt(id, 10), values);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="edit-order-page">
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <OrderForm
            title={`Edit Order #${id}`}
            submitButtonText="Update Order"
            onSubmit={handleSubmit}
            initialValues={initialValues}
            isEditing={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EditOrderPage; 