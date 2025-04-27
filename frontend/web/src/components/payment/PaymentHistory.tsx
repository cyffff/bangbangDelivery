import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Tooltip, Typography, Empty, Spin, Card } from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { PaymentService } from '../../services/PaymentService';
import { paymentApi } from '../../api/paymentApi';
import { PaymentResponse, PaymentStatus, getStatusColor } from '../../types/Payment';
import { formatDate } from '../../utils/dateUtils';

const { Title, Text } = Typography;

interface PaymentHistoryProps {
  userId?: number;
  showAsPayer?: boolean;
  showAsReceiver?: boolean;
  orderId?: number;
  title?: string;
  limit?: number;
  showViewAll?: boolean;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  userId,
  showAsPayer = true,
  showAsReceiver = true,
  orderId,
  title = 'Payment History',
  limit,
  showViewAll = false
}) => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  
  // Use current user ID if not provided
  const effectiveUserId = userId || currentUser?.id;

  useEffect(() => {
    if (!effectiveUserId && !orderId) return;
    
    fetchPayments();
  }, [effectiveUserId, orderId, showAsPayer, showAsReceiver]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let fetchedPayments: PaymentResponse[] = [];
      
      if (orderId) {
        // Fetch payments for a specific order
        fetchedPayments = await paymentApi.getPaymentsByOrderId(orderId);
      } else if (effectiveUserId) {
        // Fetch payments where user is payer
        if (showAsPayer) {
          const payerPayments = await paymentApi.getPaymentsByPayerId(effectiveUserId);
          fetchedPayments = [...fetchedPayments, ...payerPayments];
        }
        
        // Fetch payments where user is receiver
        if (showAsReceiver) {
          const receiverPayments = await paymentApi.getPaymentsByReceiverId(effectiveUserId);
          fetchedPayments = [...fetchedPayments, ...receiverPayments];
        }
        
        // Remove duplicates
        fetchedPayments = Array.from(
          new Map(fetchedPayments.map(payment => [payment.id, payment])).values()
        );
      }
      
      // Sort by creation date (newest first)
      fetchedPayments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Apply limit if provided
      if (limit && limit > 0) {
        fetchedPayments = fetchedPayments.slice(0, limit);
      }
      
      setPayments(fetchedPayments);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (paymentId: number) => {
    navigate(`/payment-result/${paymentId}`);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      width: 170
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId: number) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/orders/${orderId}`)}
          style={{ padding: 0 }}
        >
          #{orderId}
        </Button>
      ),
      width: 100
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => method.replace('_', ' '),
      width: 150
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong>{PaymentService.formatAmount(amount)}</Text>
      ),
      width: 120
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PaymentStatus) => {
        let icon;
        
        switch (status) {
          case PaymentStatus.COMPLETED:
            icon = <CheckCircleOutlined />;
            break;
          case PaymentStatus.PENDING:
          case PaymentStatus.PROCESSING:
            icon = <SyncOutlined spin />;
            break;
          case PaymentStatus.FAILED:
          case PaymentStatus.CANCELLED:
          case PaymentStatus.EXPIRED:
            icon = <CloseCircleOutlined />;
            break;
          default:
            icon = <InfoCircleOutlined />;
        }
        
        return (
          <Tooltip title={PaymentService.getPaymentStatusMessage(status)}>
            <Tag color={getStatusColor(status)} icon={icon}>
              {status.replace('_', ' ')}
            </Tag>
          </Tooltip>
        );
      },
      width: 180
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PaymentResponse) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleViewDetails(record.id)}
          >
            View Details
          </Button>
          
          {record.status === PaymentStatus.COMPLETED && (
            <Button
              type="dashed"
              size="small"
              onClick={() => navigate(`/payment/${record.orderId}/refund/${record.id}`)}
            >
              Request Refund
            </Button>
          )}
        </Space>
      ),
      width: 220
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      );
    }

    if (payments.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No payment records found"
        />
      );
    }

    return (
      <>
        <Table
          columns={columns}
          dataSource={payments.map(payment => ({ ...payment, key: payment.id }))}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
        
        {showViewAll && payments.length >= limit! && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/wallet')}>
              View All Payments
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <Card title={<Title level={4}>{title}</Title>} extra={
      <Button type="text" icon={<SyncOutlined />} onClick={fetchPayments}>
        Refresh
      </Button>
    }>
      {renderContent()}
    </Card>
  );
};

export default PaymentHistory; 