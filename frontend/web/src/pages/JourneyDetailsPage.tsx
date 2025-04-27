import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, Col, Typography, Button, Card, Steps, Divider, 
  Descriptions, List, Tag, Avatar, Rate, Space, Empty, Modal,
  message
} from 'antd';
import {
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  InboxOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import './JourneyDetailsPage.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface JourneyTask {
  id: string;
  title: string;
  status: string;
}

interface Traveler {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedJourneys: number;
}

interface Journey {
  id: string;
  title: string;
  departure: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  transportType: string;
  capacity: number;
  availableCapacity: number;
  traveler: Traveler;
  tasks: JourneyTask[];
}

// Mock data for UI development
const mockJourney: Journey = {
  id: '1',
  title: 'Tokyo to Osaka Business Trip',
  departure: 'Tokyo, Japan',
  destination: 'Osaka, Japan',
  departureDate: '2023-08-15T09:00:00',
  arrivalDate: '2023-08-15T11:30:00',
  status: 'in-progress',
  transportType: 'Train - Shinkansen',
  capacity: 3,
  availableCapacity: 1,
  traveler: {
    id: '101',
    name: 'Hiroshi Yamada',
    avatar: 'https://i.pravatar.cc/150?img=52',
    rating: 4.8,
    completedJourneys: 37
  },
  tasks: [
    { id: '201', title: 'Deliver documents to Osaka HQ', status: 'in-progress' },
    { id: '202', title: 'Pick up signed contract', status: 'pending' }
  ]
};

const JourneyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        setLoading(true);
        // In a real app, fetch from API
        // const response = await axios.get(`/api/journeys/${id}`);
        // setJourney(response.data);
        
        // For demo, use mock data
        setTimeout(() => {
          setJourney(mockJourney);
          setLoading(false);
        }, 1000);
      } catch (error) {
        message.error('Failed to load journey details');
        console.error('Error fetching journey details:', error);
        setLoading(false);
      }
    };

    fetchJourneyDetails();
  }, [id]);

  const handleCancelJourney = () => {
    setIsModalVisible(true);
  };

  const confirmCancelJourney = async () => {
    try {
      setLoading(true);
      // In a real app, call API
      // await axios.patch(`/api/journeys/${id}`, { status: 'cancelled' });
      
      // For demo, update local state
      setTimeout(() => {
        if (journey) {
          setJourney({ ...journey, status: 'cancelled' });
        }
        setIsModalVisible(false);
        setLoading(false);
        message.success('Journey cancelled successfully');
      }, 1000);
    } catch (error) {
      message.error('Failed to cancel journey');
      console.error('Error cancelling journey:', error);
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Tag color="blue">Upcoming</Tag>;
      case 'in-progress':
        return <Tag color="green">In Progress</Tag>;
      case 'completed':
        return <Tag color="purple">Completed</Tag>;
      case 'cancelled':
        return <Tag color="red">Cancelled</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <LoadingOutlined style={{ fontSize: 48 }} />
        <Text style={{ display: 'block', marginTop: 16 }}>Loading journey details...</Text>
      </div>
    );
  }

  if (!journey) {
    return (
      <Card>
        <Empty description="Journey not found" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate('/journeys')}>
            Go Back to Journeys
          </Button>
        </div>
      </Card>
    );
  }

  const currentStep = 
    journey.status === 'upcoming' ? 0 :
    journey.status === 'in-progress' ? 1 :
    journey.status === 'completed' ? 2 : 3;

  return (
    <div className="journey-details-page">
      <Row gutter={[16, 16]} className="page-header">
        <Col span={12}>
          <Button 
            type="link" 
            onClick={() => navigate('/journeys')}
            style={{ paddingLeft: 0 }}
          >
            &lt; Back to Journeys
          </Button>
          <Title level={2}>{journey.title}</Title>
          <Space>
            {getStatusTag(journey.status)}
            <Text type="secondary">{journey.transportType}</Text>
          </Space>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          {journey.status === 'upcoming' && (
            <Button type="primary" danger onClick={handleCancelJourney}>
              Cancel Journey
            </Button>
          )}
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Journey Details" className="journey-detail-card">
            <Steps current={currentStep} status={journey.status === 'cancelled' ? 'error' : 'process'}>
              <Step title="Scheduled" description="Journey planned" />
              <Step title="In Progress" description="On the way" />
              <Step title="Completed" description="Journey finished" />
            </Steps>

            <Divider />

            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Departure">
                <Space direction="vertical">
                  <Text strong>{journey.departure}</Text>
                  <Text>{dayjs(journey.departureDate).format('MMM D, YYYY - h:mm A')}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Destination">
                <Space direction="vertical">
                  <Text strong>{journey.destination}</Text>
                  <Text>{dayjs(journey.arrivalDate).format('MMM D, YYYY - h:mm A')}</Text>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic title="Transport Type" value={journey.transportType} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Capacity" value={`${journey.capacity} items`} />
              </Col>
              <Col span={8}>
                <Statistic title="Available Capacity" value={`${journey.availableCapacity} items`} />
              </Col>
            </Row>
          </Card>

          <Card title="Tasks" className="journey-tasks-card" style={{ marginTop: 16 }}>
            {journey.tasks.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={journey.tasks}
                renderItem={task => (
                  <List.Item 
                    actions={[
                      <Button type="link" onClick={() => navigate(`/task/${task.id}`)}>
                        View Task
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={task.title}
                      description={<Tag color={task.status === 'completed' ? 'green' : 'blue'}>{task.status}</Tag>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No tasks assigned to this journey yet" />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Traveler Information" className="traveler-card">
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar src={journey.traveler.avatar} size={80} />
              <Title level={4} style={{ marginTop: 16, marginBottom: 0 }}>
                {journey.traveler.name}
              </Title>
              <Space>
                <Rate disabled defaultValue={journey.traveler.rating} allowHalf />
                <Text>{journey.traveler.rating}/5</Text>
              </Space>
              <Paragraph>
                <Text type="secondary">
                  {journey.traveler.completedJourneys} journeys completed
                </Text>
              </Paragraph>
            </div>

            <div style={{ marginTop: 16 }}>
              <Button 
                type="primary" 
                block
                onClick={() => navigate(`/messages/${journey.traveler.id}`)}
              >
                Message Traveler
              </Button>
              
              <Button 
                block
                style={{ marginTop: 8 }}
                onClick={() => navigate(`/profile/${journey.traveler.id}`)}
              >
                View Profile
              </Button>
            </div>
          </Card>
          
          <Card title="Journey Route" className="journey-map-card" style={{ marginTop: 16 }}>
            <div 
              className="journey-map-placeholder" 
              style={{ 
                height: 200, 
                background: '#f0f2f5', 
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Space direction="vertical" align="center">
                <EnvironmentOutlined style={{ fontSize: 24 }} />
                <Text type="secondary">Map view would appear here</Text>
              </Space>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <EnvironmentOutlined />
                  <Text strong>{journey.departure}</Text>
                </Space>
                <div style={{ borderLeft: '1px dashed #ccc', margin: '4px 0 4px 8px', height: 24 }}></div>
                <Space>
                  <EnvironmentOutlined />
                  <Text strong>{journey.destination}</Text>
                </Space>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Cancel Journey"
        open={isModalVisible}
        onOk={confirmCancelJourney}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes, Cancel Journey"
        cancelText="No, Keep Journey"
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical">
          <Space>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
            <Text strong>Are you sure you want to cancel this journey?</Text>
          </Space>
          <Text>
            This action cannot be undone. All tasks associated with this journey will need to be reassigned.
          </Text>
        </Space>
      </Modal>
    </div>
  );
};

// Statistic component for consistent display
const Statistic = ({ title, value }: { title: string, value: string }) => (
  <div className="journey-statistic">
    <Text type="secondary" style={{ display: 'block' }}>{title}</Text>
    <Text strong style={{ fontSize: 16 }}>{value}</Text>
  </div>
);

export default JourneyDetailsPage; 