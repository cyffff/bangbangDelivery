import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, message, Popconfirm, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Order, OrderStatus, getStatusColor, getNextStatuses } from '../../types/Order';
import { orderApi } from '../../api/orderApi';
import { formatDate } from '../../utils/dateUtils';

const { Option } = Select;

interface OrderListProps {
  userId?: number;
  isForDemander?: boolean;
  isForTraveler?: boolean;
  journeyId?: number;
  demandId?: number;
  status?: OrderStatus;
}

const OrderList: React.FC<OrderListProps> = ({
  userId,
  isForDemander = false,
  isForTraveler = false,
  journeyId,
  demandId,
  status
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let fetchedOrders: Order[] = [];

      if (userId && isForDemander && status) {
        fetchedOrders = await orderApi.getOrdersByDemanderIdAndStatus(userId, status);
      } else if (userId && isForTraveler && status) {
        fetchedOrders = await orderApi.getOrdersByTravelerIdAndStatus(userId, status);
      } else if (userId && isForDemander) {
        fetchedOrders = await orderApi.getOrdersByDemanderId(userId);
      } else if (userId && isForTraveler) {
        fetchedOrders = await orderApi.getOrdersByTravelerId(userId);
      } else if (journeyId) {
        fetchedOrders = await orderApi.getOrdersByJourneyId(journeyId);
      } else if (demandId) {
        fetchedOrders = await orderApi.getOrdersByDemandId(demandId);
      } else if (status) {
        fetchedOrders = await orderApi.getOrdersByStatus(status);
      } else {
        // Default to showing all orders - this might need admin permission
        message.error('Invalid filter combination for orders');
      }

      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, isForDemander, isForTraveler, journeyId, demandId, status]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      message.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      message.error('Failed to update order status. Please try again.');
    }
  };

  const handleDelete = async (orderId: number) => {
    try {
      await orderApi.deleteOrder(orderId);
      message.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      message.error('Failed to delete order. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Pickup Location',
      dataIndex: 'pickupLocation',
      key: 'pickupLocation',
    },
    {
      title: 'Delivery Location',
      dataIndex: 'deliveryLocation',
      key: 'deliveryLocation',
    },
    {
      title: 'Expected Pickup',
      dataIndex: 'expectedPickupDate',
      key: 'expectedPickupDate',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Order) => (
        <Space size="middle">
          <Link to={`/orders/${record.id}`}>
            <Button type="primary" size="small">
              View
            </Button>
          </Link>
          
          {/* Status update dropdown */}
          {getNextStatuses(record.status).length > 0 && (
            <Select
              placeholder="Update Status"
              style={{ width: 140 }}
              onChange={(value) => handleStatusChange(record.id, value as OrderStatus)}
            >
              {getNextStatuses(record.status).map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          )}
          
          {/* Only show delete for orders that are not in progress */}
          {['CREATED', 'CANCELLED', 'COMPLETED'].includes(record.status) && (
            <Popconfirm
              title="Are you sure you want to delete this order?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger size="small">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="order-list">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Orders</h2>
        {(isForDemander || userId) && (
          <Button type="primary" onClick={() => navigate('/orders/create')}>
            Create New Order
          </Button>
        )}
      </div>
      <Table
        columns={columns}
        dataSource={orders.map(order => ({ ...order, key: order.id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OrderList; 