import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag, Spin, message, Space, Popconfirm, Select } from 'antd';
import { ArrowLeftOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Order, OrderStatus, getStatusColor, getNextStatuses } from '../../types/Order';
import { orderApi } from '../../api/orderApi';
import { formatDate } from '../../utils/dateUtils';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';

const { Option } = Select;

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const fetchOrder = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const orderData = await orderApi.getOrderById(Number(id));
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      message.error('Failed to load order details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    try {
      await orderApi.updateOrderStatus(order.id, newStatus);
      message.success(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (error) {
      console.error('Failed to update order status:', error);
      message.error('Failed to update order status. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    
    try {
      await orderApi.deleteOrder(order.id);
      message.success('Order deleted successfully');
      navigate('/orders');
    } catch (error) {
      console.error('Failed to delete order:', error);
      message.error('Failed to delete order. Please try again.');
    }
  };

  const handlePayment = () => {
    if (!order || !currentUser) return;
    
    // Determine if the current user is the demander or the traveler
    const isUserDemander = currentUser.id === order.demanderId;
    const isUserTraveler = currentUser.id === order.travelerId;
    
    if (!isUserDemander && !isUserTraveler) {
      message.error('You are not authorized to make a payment for this order');
      return;
    }
    
    // If user is demander, they are paying the traveler
    // If user is traveler, they might be paying the platform fee
    const payerId = currentUser.id;
    const receiverId = isUserDemander ? order.travelerId : 1; // 1 is platform admin ID
    
    navigate(`/payment/${order.id}?amount=${order.price}&payerId=${payerId}&receiverId=${receiverId}`);
  };

  const shouldShowPayButton = () => {
    if (!order || !currentUser) return false;
    
    // Only show pay button for accepted orders and pending payment
    const payableStatuses = ['ACCEPTED', 'PENDING_PAYMENT'];
    
    return payableStatuses.includes(order.status) && 
      (currentUser.id === order.demanderId || currentUser.id === order.travelerId);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <h2>Order not found</h2>
        <Button type="primary" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
          
          <Space>
            {shouldShowPayButton() && (
              <Button 
                type="primary" 
                icon={<CreditCardOutlined />} 
                onClick={handlePayment}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Pay Now
              </Button>
            )}
            
            <Button type="primary" onClick={() => navigate(`/orders/${order.id}/edit`)}>
              Edit Order
            </Button>
            
            {getNextStatuses(order.status).length > 0 && (
              <Select
                placeholder="Update Status"
                style={{ width: 140 }}
                onChange={(value) => handleStatusChange(value as OrderStatus)}
              >
                {getNextStatuses(order.status).map(status => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
            )}
            
            {['CREATED', 'CANCELLED', 'COMPLETED'].includes(order.status) && (
              <Popconfirm
                title="Are you sure you want to delete this order?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
        
        <Card title={`Order #${order.id}`} extra={<Tag color={getStatusColor(order.status)}>{order.status}</Tag>}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Item Name">{order.itemName}</Descriptions.Item>
            <Descriptions.Item label="Weight">{order.weight} kg</Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>{order.description || 'No description provided'}</Descriptions.Item>
            <Descriptions.Item label="Volume">{order.volume} m³</Descriptions.Item>
            <Descriptions.Item label="Price">${order.price.toFixed(2)}</Descriptions.Item>
            
            <Descriptions.Item label="Pickup Location" span={2}>{order.pickupLocation}</Descriptions.Item>
            <Descriptions.Item label="Delivery Location" span={2}>{order.deliveryLocation}</Descriptions.Item>
            
            <Descriptions.Item label="Expected Pickup Date">{formatDate(order.expectedPickupDate)}</Descriptions.Item>
            <Descriptions.Item label="Actual Pickup Date">{order.actualPickupDate ? formatDate(order.actualPickupDate) : 'Not yet picked up'}</Descriptions.Item>
            
            <Descriptions.Item label="Expected Delivery Date">{formatDate(order.expectedDeliveryDate)}</Descriptions.Item>
            <Descriptions.Item label="Actual Delivery Date">{order.actualDeliveryDate ? formatDate(order.actualDeliveryDate) : 'Not yet delivered'}</Descriptions.Item>
            
            <Descriptions.Item label="Demand ID">{order.demandId}</Descriptions.Item>
            <Descriptions.Item label="Journey ID">{order.journeyId}</Descriptions.Item>
            
            <Descriptions.Item label="Demander ID">{order.demanderId}</Descriptions.Item>
            <Descriptions.Item label="Traveler ID">{order.travelerId}</Descriptions.Item>
            
            <Descriptions.Item label="Created At">{formatDate(order.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Updated At">{formatDate(order.updatedAt)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default OrderDetail; 