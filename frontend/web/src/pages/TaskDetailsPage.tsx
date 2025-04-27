import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, Typography, Descriptions, Divider, Button, Tag, Space, 
  Avatar, List, Form, Input, Rate, Modal, message, Spin, Row, Col, Timeline, Empty, Result,
  Popconfirm, Badge
} from 'antd';
import { 
  UserOutlined, EnvironmentOutlined, ShoppingOutlined, 
  DollarOutlined, ClockCircleOutlined, CalendarOutlined,
  MessageOutlined, CheckCircleOutlined, SendOutlined,
  ArrowLeftOutlined, ExclamationCircleOutlined, 
  CloseCircleOutlined, EyeOutlined, StarOutlined,
  ExpandOutlined, CloseOutlined
} from '@ant-design/icons';
import './TaskDetailsPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock data - would be fetched from API in real implementation
const MOCK_TASK = {
  id: '1',
  title: 'Need iPhone 15 Pro from NYC to Shanghai',
  itemType: 'electronics',
  itemName: 'iPhone 15 Pro (256GB, Titanium)',
  weight: 0.5,
  size: {
    length: 15,
    width: 7,
    height: 2
  },
  originCity: 'New York',
  originCountry: 'USA',
  destinationCity: 'Shanghai',
  destinationCountry: 'China',
  deliveryMethod: 'meet',
  requesterName: 'Wei Zhang',
  requesterPhone: '+86 123 4567 8901',
  requesterAvatar: null,
  requesterRating: 4.8,
  recipientName: 'Li Ming',
  recipientPhone: '+86 987 6543 2109',
  reward: 150,
  status: 'open',
  createdAt: '2023-10-15T08:30:00Z',
  deadline: '2023-11-30T00:00:00Z',
  description: 'Looking for someone traveling from NYC to Shanghai who can bring a sealed iPhone 15 Pro. The item is brand new in the box and has all receipts. Can meet at JFK airport or anywhere in Manhattan for handover.',
  itemPhotos: [
    'https://placehold.co/400x300/e2e8f0/1e293b?text=iPhone+15+Pro',
    'https://placehold.co/400x300/e2e8f0/1e293b?text=Box+Photo'
  ],
  offers: [
    {
      id: '101',
      travelerName: 'John Smith',
      travelerAvatar: null,
      travelerRating: 4.9,
      price: 180,
      estimatedDeliveryDate: '2023-11-20T00:00:00Z',
      message: 'I am flying from NYC to Shanghai on Nov 18. Can meet at JFK Terminal 4 around noon.',
      status: 'pending',
      createdAt: '2023-10-20T15:45:00Z'
    },
    {
      id: '102',
      travelerName: 'Emily Chen',
      travelerAvatar: null,
      travelerRating: 5.0,
      price: 165,
      estimatedDeliveryDate: '2023-11-15T00:00:00Z',
      message: 'Flying direct from Newark to Shanghai on Nov 12. Can meet at Newark Terminal B or in Manhattan before my flight.',
      status: 'pending',
      createdAt: '2023-10-19T09:22:00Z'
    }
  ]
};

// Format date helper
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm] = Form.useForm();
  const [messageForm] = Form.useForm();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock auth state
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Mock data loading
  useEffect(() => {
    setLoading(true);
    setLoadingError(null);
    
    // Simulate API call - in a real app, this would fetch from backend
    setTimeout(() => {
      try {
        // Check if task exists (simulating API error handling)
        if (!id || id !== '1') {
          setLoadingError('Task not found');
          setLoading(false);
          return;
        }
        
        setTask(MOCK_TASK);
        setLoading(false);
      } catch (error) {
        setLoadingError('Failed to load task details');
        setLoading(false);
      }
    }, 700);
  }, [id]);

  const handleSendMessage = async (values: any) => {
    if (!isAuthenticated) {
      message.error('Please log in to send messages');
      return;
    }
    
    try {
      setSubmittingMessage(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Message sent:', values);
      message.success('Message sent successfully');
      messageForm.resetFields();
    } catch (error) {
      message.error('Failed to send message');
    } finally {
      setSubmittingMessage(false);
    }
  };

  const handleSubmitOffer = async (values: any) => {
    if (!isAuthenticated) {
      message.error('Please log in to submit an offer');
      return;
    }
    
    try {
      setSubmittingOffer(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Offer submitted:', values);
      message.success('Your offer has been submitted!');
      setShowOfferModal(false);
      offerForm.resetFields();
    } catch (error) {
      message.error('Failed to submit offer');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      setProcessingAction(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Accepting offer:', offerId);
      message.success('Offer accepted! Please contact the traveler for coordination.');
      
      // Update the task status in a real app
      // In this mock example, we'll just update the UI
      const updatedTask = { ...task, status: 'in_progress' };
      setTask(updatedTask);
    } catch (error) {
      message.error('Failed to accept offer');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDeclineOffer = async (offerId: string) => {
    try {
      setProcessingAction(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Declining offer:', offerId);
      message.success('Offer declined');
      
      // Update the offers array in a real app
      // In this mock example, we'll just update the UI
      const updatedOffers = task.offers.filter((offer: any) => offer.id !== offerId);
      const updatedTask = { ...task, offers: updatedOffers };
      setTask(updatedTask);
    } catch (error) {
      message.error('Failed to decline offer');
    } finally {
      setProcessingAction(false);
    }
  };

  const openLightbox = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  // Handle error or loading states
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Loading task details..." />
      </div>
    );
  }

  if (loadingError) {
    return (
      <Result
        status="error"
        title="Could not load task details"
        subTitle={loadingError}
        extra={[
          <Button type="primary" key="back" onClick={() => navigate(-1)}>
            Go Back
          </Button>,
        ]}
      />
    );
  }

  if (!task) {
    return (
      <Empty
        description="Task not found"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Empty>
    );
  }

  const getItemTypeTag = (type: string) => {
    const typeColors: Record<string, string> = {
      food: 'green',
      electronics: 'blue',
      documents: 'purple',
      clothing: 'magenta',
      medicine: 'red',
      other: 'default'
    };
    
    return <Tag color={typeColors[type] || 'default'}>{type.toUpperCase()}</Tag>;
  };

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: 20 }}>
        <Button 
          onClick={() => navigate(-1)} 
          icon={<ArrowLeftOutlined />}
          aria-label="Go back"
        >
          Back
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} className="task-detail-card">
            <Title level={2}>{task.title}</Title>
            
            <Space style={{ marginBottom: 16 }} wrap>
              <Tag className="item-type-tag" color={getItemTypeTag(task.itemType).props.color}>
                {task.itemType.toUpperCase()}
              </Tag>
              <Tag className="status-tag" color={task.status === 'open' ? 'green' : task.status === 'in_progress' ? 'blue' : 'default'}>
                {task.status.toUpperCase()}
              </Tag>
              <Text type="secondary">
                Posted on {formatDate(task.createdAt)}
              </Text>
            </Space>
            
            <Divider />
            
            <Title level={4}>Item Details</Title>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Item Name" labelStyle={{ fontWeight: 'bold' }}>
                <Space>
                  <ShoppingOutlined />
                  {task.itemName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Weight" labelStyle={{ fontWeight: 'bold' }}>
                {task.weight} kg
              </Descriptions.Item>
              {task.size && (
                <Descriptions.Item label="Size" labelStyle={{ fontWeight: 'bold' }}>
                  {task.size.length} × {task.size.width} × {task.size.height} cm
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Reward" labelStyle={{ fontWeight: 'bold' }}>
                <Space>
                  <DollarOutlined />
                  <Text strong>${task.reward}</Text>
                </Space>
              </Descriptions.Item>
            </Descriptions>
            
            {task.description && (
              <>
                <Divider />
                <Title level={4}>Description</Title>
                <Card className="description-card">
                  <Paragraph>{task.description}</Paragraph>
                </Card>
              </>
            )}
            
            {task.itemPhotos && task.itemPhotos.length > 0 && (
              <>
                <Divider />
                <Title level={4}>Photos</Title>
                <div className="photos-container">
                  {task.itemPhotos.map((photo: string, index: number) => (
                    <img 
                      key={index} 
                      src={photo} 
                      alt={`Item photo ${index + 1}`}
                      className="item-photo" 
                      onClick={() => openLightbox(photo)}
                      style={{ width: 200, height: 150, objectFit: 'cover' }}
                    />
                  ))}
                </div>
              </>
            )}
            
            <Divider />
            <Title level={4}>Delivery Information</Title>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="From" labelStyle={{ fontWeight: 'bold' }}>
                <Space direction="vertical">
                  <Space>
                    <EnvironmentOutlined />
                    {task.originCity}, {task.originCountry}
                  </Space>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="To" labelStyle={{ fontWeight: 'bold' }}>
                <Space direction="vertical">
                  <Space>
                    <EnvironmentOutlined />
                    {task.destinationCity}, {task.destinationCountry}
                  </Space>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Method" labelStyle={{ fontWeight: 'bold' }}>
                {task.deliveryMethod === 'meet' && 'Meet in Person'}
                {task.deliveryMethod === 'courier' && 'Local Courier'}
                {task.deliveryMethod === 'home' && 'Home Delivery'}
              </Descriptions.Item>
              <Descriptions.Item label="Deadline" labelStyle={{ fontWeight: 'bold' }}>
                <Space>
                  <CalendarOutlined />
                  {formatDate(task.deadline)}
                </Space>
              </Descriptions.Item>
            </Descriptions>
            
            {task.offers && task.offers.length > 0 && (
              <>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4}>Offers ({task.offers.length})</Title>
                  <Badge count={task.offers.length} style={{ backgroundColor: '#1890ff' }} />
                </div>
                <List
                  itemLayout="vertical"
                  dataSource={task.offers}
                  renderItem={(offer: any) => (
                    <List.Item
                      key={offer.id}
                      className="offer-list-item"
                      actions={[
                        <Button key="contact" icon={<MessageOutlined />}>
                          Contact
                        </Button>,
                        <Popconfirm
                          title="Decline this offer?"
                          description="Are you sure you want to decline this offer?"
                          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                          onConfirm={() => handleDeclineOffer(offer.id)}
                          okText="Yes"
                          cancelText="No"
                          disabled={processingAction}
                        >
                          <Button 
                            key="decline" 
                            icon={<CloseCircleOutlined />}
                            danger
                            loading={processingAction}
                          >
                            Decline
                          </Button>
                        </Popconfirm>,
                        <Popconfirm
                          title="Accept this offer?"
                          description="This will match you with this traveler"
                          icon={<ExclamationCircleOutlined style={{ color: 'green' }} />}
                          onConfirm={() => handleAcceptOffer(offer.id)}
                          okText="Yes"
                          cancelText="No"
                          disabled={processingAction}
                        >
                          <Button 
                            key="accept" 
                            type="primary" 
                            icon={<CheckCircleOutlined />}
                            loading={processingAction}
                          >
                            Accept Offer
                          </Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <Space>
                            <Text strong>{offer.travelerName}</Text>
                            <Rate disabled defaultValue={offer.travelerRating} style={{ fontSize: 14 }} />
                            <Text type="secondary">({offer.travelerRating})</Text>
                          </Space>
                        }
                        description={
                          <Space direction="vertical">
                            <Text type="secondary">
                              <ClockCircleOutlined /> Offered on {formatDate(offer.createdAt)}
                            </Text>
                            <Space>
                              <Text className="offer-price">
                                <DollarOutlined />${offer.price}
                              </Text>
                              <Divider type="vertical" />
                              <CalendarOutlined />
                              <Text>Delivery by {formatDate(offer.estimatedDeliveryDate)}</Text>
                            </Space>
                          </Space>
                        }
                      />
                      <Paragraph style={{ marginTop: 8 }}>{offer.message}</Paragraph>
                    </List.Item>
                  )}
                />
              </>
            )}
            
            <Divider />
            <Form form={messageForm} onFinish={handleSendMessage} className="message-form">
              <Form.Item 
                name="message" 
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea 
                  rows={2} 
                  placeholder="Ask a question about this task..."
                  disabled={!isAuthenticated}
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />}
                  loading={submittingMessage}
                  disabled={!isAuthenticated}
                >
                  Send Message
                </Button>
                {!isAuthenticated && (
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Please <Link to="/login">login</Link> to send messages
                  </Text>
                )}
              </Form.Item>
            </Form>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card bordered={false} className="user-info-card sticky-sidebar" style={{ position: 'sticky', top: '90px' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar size={64} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 8, marginBottom: 4 }}>
                {task.requesterName}
              </Title>
              <Rate disabled defaultValue={task.requesterRating} style={{ fontSize: 14 }} />
              <Text type="secondary"> ({task.requesterRating})</Text>
            </div>
            
            <div className="timeline-container">
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: (
                      <>
                        <Text strong>Request Created</Text>
                        <br />
                        <Text type="secondary">{formatDate(task.createdAt)}</Text>
                      </>
                    ),
                  },
                  {
                    color: task.status !== 'open' ? 'green' : 'blue',
                    children: (
                      <>
                        <Text strong>Accepting Offers</Text>
                        <br />
                        <Text type="secondary">Until matched with a traveler</Text>
                      </>
                    ),
                  },
                  {
                    color: task.status === 'in_progress' ? 'blue' : '#ccc',
                    children: (
                      <>
                        <Text strong>In Transit</Text>
                        <br />
                        <Text type="secondary">Once a traveler accepts</Text>
                      </>
                    ),
                  },
                  {
                    color: task.status === 'completed' ? 'green' : '#ccc',
                    children: (
                      <>
                        <Text strong>Delivered</Text>
                        <br />
                        <Text type="secondary">When the item reaches its destination</Text>
                      </>
                    ),
                  },
                ]}
              />
            </div>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                block
                onClick={() => isAuthenticated ? setShowOfferModal(true) : message.warning('Please log in to make an offer')}
                disabled={task.status !== 'open'}
              >
                Make an Offer
              </Button>
              
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                {task.status === 'open' ? `Reward starts at $${task.reward}` : 
                 task.status === 'in_progress' ? 'This task has been assigned to a traveler' :
                 'This task has been completed'}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Modal
        title="Make an Offer"
        open={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
        footer={null}
        maskClosable={!submittingOffer}
        closable={!submittingOffer}
      >
        <Form 
          form={offerForm} 
          layout="vertical" 
          onFinish={handleSubmitOffer}
          initialValues={{ price: task.reward }}
        >
          <Form.Item
            name="price"
            label="Your Price ($)"
            rules={[{ required: true, message: 'Please enter your price' }]}
          >
            <Input type="number" min={1} prefix="$" />
          </Form.Item>
          
          <Form.Item
            name="estimatedDeliveryDate"
            label="Estimated Delivery Date"
            rules={[{ required: true, message: 'Please select an estimated delivery date' }]}
          >
            <Input type="date" />
          </Form.Item>
          
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please include a message with your offer' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Introduce yourself and provide details about your travel plans..."
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submittingOffer}>
              Submit Offer
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="photo-lightbox" onClick={closeLightbox}>
          <img src={selectedPhoto} alt="Enlarged view" />
          <CloseOutlined className="photo-lightbox-close" onClick={closeLightbox} />
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPage; 