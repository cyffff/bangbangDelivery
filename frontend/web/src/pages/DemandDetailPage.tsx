import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Typography, 
  Descriptions, 
  Tag, 
  Divider, 
  Space, 
  Button, 
  Row, 
  Col,
  Statistic, 
  Modal, 
  Skeleton, 
  Alert,
  message
} from 'antd';
import { 
  GlobalOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  ShoppingOutlined, 
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  UserOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { 
  fetchDemandById, 
  cancelDemand, 
  deleteDemand,
  selectCurrentDemand, 
  selectDemandLoading,
  selectDemandError,
  clearError
} from '../store/slices/demandSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

// Status color mapping
const statusColors = {
  PENDING: 'blue',
  ACCEPTED: 'orange',
  IN_TRANSIT: 'purple',
  DELIVERED: 'green',
  CANCELLED: 'red'
};

const DemandDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const demand = useSelector(selectCurrentDemand);
  const loading = useSelector(selectDemandLoading);
  const error = useSelector(selectDemandError);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  
  // Check if current user is the owner of the demand
  const isOwner = demand && currentUser && demand.userId === currentUser.id.toString();
  const isPending = demand && demand.status === 'PENDING';
  const isDelivered = demand && demand.status === 'DELIVERED';
  const isCancelled = demand && demand.status === 'CANCELLED';
  
  useEffect(() => {
    if (id) {
      dispatch(fetchDemandById(id) as any);
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);
  
  const handleEdit = () => {
    navigate(`/demands/edit/${id}`);
  };
  
  const handleDelete = () => {
    if (id) {
      dispatch(deleteDemand(id) as any)
        .unwrap()
        .then(() => {
          message.success('Demand deleted successfully');
          navigate('/demands');
        })
        .catch(() => {
          // Error will be handled by the reducer and displayed in the UI
        });
    }
    setDeleteModalVisible(false);
  };
  
  const handleCancel = () => {
    if (id) {
      dispatch(cancelDemand(id) as any)
        .unwrap()
        .then(() => {
          message.success('Demand cancelled successfully');
        })
        .catch(() => {
          // Error will be handled by the reducer and displayed in the UI
        });
    }
    setCancelModalVisible(false);
  };
  
  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <Skeleton active avatar paragraph={{ rows: 10 }} />
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => navigate('/demands')}>
              Back to Demands
            </Button>
          }
        />
      </div>
    );
  }
  
  if (!demand) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Not Found"
          description="The demand you're looking for does not exist or has been removed."
          type="warning"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => navigate('/demands')}>
              Back to Demands
            </Button>
          }
        />
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div style={{ padding: '24px 0' }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          marginBottom: 24
        }}
      >
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Title level={2} style={{ marginBottom: 8 }}>{demand.title}</Title>
            <Space size="middle">
              <Tag color={statusColors[demand.status as keyof typeof statusColors]} style={{ fontSize: '14px' }}>
                {demand.status.replace('_', ' ')}
              </Tag>
              <Text type="secondary">
                <UserOutlined style={{ marginRight: 4 }} />
                Posted by: User {demand.userId}
              </Text>
              <Text type="secondary">
                <EyeOutlined style={{ marginRight: 4 }} />
                {demand.viewCount} views
              </Text>
              <Text type="secondary">
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                Posted on {formatDate(demand.createdAt)}
              </Text>
            </Space>
          </Col>
          
          {isAuthenticated && isOwner && (
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Space>
                {isPending && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    disabled={!isPending}
                  >
                    Edit
                  </Button>
                )}
                
                {isPending && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setDeleteModalVisible(true)}
                  >
                    Delete
                  </Button>
                )}
                
                {!isCancelled && !isDelivered && (
                  <Button
                    icon={<StopOutlined />}
                    onClick={() => setCancelModalVisible(true)}
                  >
                    Cancel
                  </Button>
                )}
              </Space>
            </Col>
          )}
        </Row>
      </Card>
      
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              marginBottom: 24
            }}
          >
            <Title level={4}>Demand Details</Title>
            
            {demand.description && (
              <>
                <Paragraph>{demand.description}</Paragraph>
                <Divider />
              </>
            )}
            
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Item Type">
                <Tag color="cyan">{demand.itemType}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Weight">
                {demand.weightKg} kg
              </Descriptions.Item>
              
              {demand.estimatedValue && (
                <Descriptions.Item label="Estimated Value">
                  ${demand.estimatedValue}
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label="Reward Amount">
                <Text strong style={{ color: '#52c41a' }}>${demand.rewardAmount}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label="Origin" span={2}>
                <GlobalOutlined style={{ marginRight: 8 }} />
                {demand.originCity}, {demand.originCountry}
              </Descriptions.Item>
              
              <Descriptions.Item label="Destination" span={2}>
                <GlobalOutlined style={{ marginRight: 8 }} />
                {demand.destinationCity}, {demand.destinationCountry}
              </Descriptions.Item>
              
              <Descriptions.Item label="Delivery Deadline">
                <CalendarOutlined style={{ marginRight: 8 }} />
                {formatDate(demand.deadline)}
              </Descriptions.Item>
              
              <Descriptions.Item label="Status">
                <Tag color={statusColors[demand.status as keyof typeof statusColors]}>
                  {demand.status.replace('_', ' ')}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              marginBottom: 24
            }}
          >
            <Title level={4}>Summary</Title>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Reward"
                  value={demand.rewardAmount || 0}
                  prefix={<DollarOutlined />}
                  precision={2}
                />
              </Col>
              
              <Col span={12}>
                <Statistic
                  title="Weight"
                  value={demand.weightKg}
                  suffix="kg"
                  precision={1}
                />
              </Col>
              
              <Col span={24}>
                <Statistic
                  title="Days Until Deadline"
                  value={Math.max(0, Math.ceil((new Date(demand.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  suffix="days"
                />
              </Col>
            </Row>
            
            <Divider />
            
            {!isOwner && isAuthenticated && demand.status === 'PENDING' && (
              <Button
                type="primary"
                icon={<ShoppingOutlined />}
                size="large"
                block
                onClick={() => navigate(`/journeys/create?demandId=${demand.id}`)}
              >
                Offer to Deliver
              </Button>
            )}
            
            {!isAuthenticated && (
              <Button
                type="primary"
                size="large"
                block
                onClick={() => navigate('/login', { state: { from: `/demands/${demand.id}` } })}
              >
                Login to Offer Delivery
              </Button>
            )}
          </Card>
          
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Title level={4}>Contact</Title>
            <Paragraph>
              <Button
                type="default"
                block
                disabled={!isAuthenticated}
                onClick={() => navigate(`/messages/new?userId=${demand.userId}`)}
              >
                Contact Demand Owner
              </Button>
            </Paragraph>
            
            {!isAuthenticated && (
              <Paragraph type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                Please log in to contact the demand owner
              </Paragraph>
            )}
          </Card>
        </Col>
      </Row>
      
      {/* Delete confirmation modal */}
      <Modal
        title="Delete Demand"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this demand? This action cannot be undone.</p>
      </Modal>
      
      {/* Cancel confirmation modal */}
      <Modal
        title="Cancel Demand"
        visible={cancelModalVisible}
        onOk={handleCancel}
        onCancel={() => setCancelModalVisible(false)}
        okText="Cancel Demand"
        okButtonProps={{ danger: true }}
        cancelText="Keep Active"
      >
        <p>Are you sure you want to cancel this demand? All current delivery offers will be cancelled.</p>
      </Modal>
    </div>
  );
};

export default DemandDetailPage; 