import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Typography, 
  Tabs, 
  List, 
  Card, 
  Button, 
  Tag, 
  Space, 
  Avatar, 
  Row, 
  Col,
  Empty,
  Form,
  Input,
  DatePicker,
  Select,
  notification,
  Skeleton
} from 'antd';
import { 
  PlusOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  CalendarOutlined,
  InboxOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './JourneysPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  traveler: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    completedJourneys: number;
  };
  tasks: {
    id: string;
    title: string;
    status: string;
  }[];
}

const mockJourneys: Journey[] = [
  {
    id: '1',
    title: 'New York to London',
    departure: 'New York, USA',
    destination: 'London, UK',
    departureDate: '2023-11-15T10:00:00',
    arrivalDate: '2023-11-15T22:30:00',
    status: 'upcoming',
    transportType: 'Flight',
    capacity: 20,
    availableCapacity: 15,
    traveler: {
      id: 'user1',
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 4.8,
      completedJourneys: 12
    },
    tasks: [
      { id: 'task1', title: 'Deliver iPhone 13', status: 'accepted' },
      { id: 'task2', title: 'Deliver Document Package', status: 'pending' }
    ]
  },
  {
    id: '2',
    title: 'Paris to Barcelona',
    departure: 'Paris, France',
    destination: 'Barcelona, Spain',
    departureDate: '2023-11-20T08:45:00',
    arrivalDate: '2023-11-20T11:15:00',
    status: 'upcoming',
    transportType: 'Train',
    capacity: 10,
    availableCapacity: 8,
    traveler: {
      id: 'user2',
      name: 'Marie Dubois',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 4.9,
      completedJourneys: 24
    },
    tasks: []
  },
  {
    id: '3',
    title: 'Tokyo to Seoul',
    departure: 'Tokyo, Japan',
    destination: 'Seoul, South Korea',
    departureDate: '2023-11-05T15:30:00',
    arrivalDate: '2023-11-05T18:30:00',
    status: 'in-progress',
    transportType: 'Flight',
    capacity: 15,
    availableCapacity: 5,
    traveler: {
      id: 'user3',
      name: 'Takashi Yamamoto',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 4.7,
      completedJourneys: 18
    },
    tasks: [
      { id: 'task3', title: 'Deliver Gaming Console', status: 'in-progress' },
      { id: 'task4', title: 'Deliver Fashion Items', status: 'in-progress' }
    ]
  },
  {
    id: '4',
    title: 'Berlin to Munich',
    departure: 'Berlin, Germany',
    destination: 'Munich, Germany',
    departureDate: '2023-10-28T09:00:00',
    arrivalDate: '2023-10-28T12:00:00',
    status: 'completed',
    transportType: 'Train',
    capacity: 12,
    availableCapacity: 0,
    traveler: {
      id: 'user4',
      name: 'Hans Schmidt',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      rating: 4.9,
      completedJourneys: 32
    },
    tasks: [
      { id: 'task5', title: 'Deliver Laptop', status: 'completed' },
      { id: 'task6', title: 'Deliver Art Supplies', status: 'completed' }
    ]
  },
  {
    id: '5',
    title: 'Singapore to Kuala Lumpur',
    departure: 'Singapore',
    destination: 'Kuala Lumpur, Malaysia',
    departureDate: '2023-10-30T14:00:00',
    arrivalDate: '2023-10-30T15:30:00',
    status: 'cancelled',
    transportType: 'Train',
    capacity: 8,
    availableCapacity: 8,
    traveler: {
      id: 'user5',
      name: 'Lim Wei',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      rating: 4.6,
      completedJourneys: 15
    },
    tasks: []
  }
];

const JourneysPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewJourney, setIsNewJourney] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/journey/new') {
      setIsNewJourney(true);
    } else {
      setIsNewJourney(false);
      
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setJourneys(mockJourneys);
        setLoading(false);
      }, 1000);
    }
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const getFilteredJourneys = () => {
    if (activeTab === 'all') {
      return journeys;
    }
    return journeys.filter(journey => journey.status === activeTab);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Tag color="blue">Upcoming</Tag>;
      case 'in-progress':
        return <Tag color="green">In Progress</Tag>;
      case 'completed':
        return <Tag color="gray">Completed</Tag>;
      case 'cancelled':
        return <Tag color="red">Cancelled</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleCreateJourney = () => {
    navigate('/journey/new');
  };

  const handleViewJourney = (id: string) => {
    navigate(`/journey/${id}`);
  };

  const handleSubmitJourney = (values: any) => {
    console.log('Form values:', values);
    // Here you would normally send this to your API
    notification.success({
      message: 'Journey Created',
      description: 'Your journey has been successfully created.'
    });
    navigate('/journeys');
  };

  const renderJourneyItem = (item: Journey) => (
    <List.Item 
      key={item.id}
      actions={[
        <Button 
          type="link" 
          onClick={() => handleViewJourney(item.id)}
          style={{ padding: 0 }}
        >
          View Details
        </Button>
      ]}
    >
      <Skeleton avatar title={false} loading={loading} active>
        <List.Item.Meta
          avatar={<Avatar src={item.traveler.avatar} size={48} />}
          title={
            <Space direction="vertical" size={0}>
              <Text strong>{item.title}</Text>
              <Space>
                {getStatusTag(item.status)}
                <Text type="secondary">{item.transportType}</Text>
              </Space>
            </Space>
          }
          description={
            <Space direction="vertical" size={4}>
              <Space>
                <EnvironmentOutlined />
                <Text>{item.departure} → {item.destination}</Text>
              </Space>
              <Space>
                <CalendarOutlined />
                <Text>{dayjs(item.departureDate).format('MMM D, YYYY')} | </Text>
                <ClockCircleOutlined />
                <Text>{dayjs(item.departureDate).format('h:mm A')} - {dayjs(item.arrivalDate).format('h:mm A')}</Text>
              </Space>
            </Space>
          }
        />
        <Space>
          <InboxOutlined />
          <Text>{item.availableCapacity}/{item.capacity} items capacity</Text>
        </Space>
      </Skeleton>
    </List.Item>
  );

  const renderJourneysList = () => (
    <div className="journey-page">
      <Row gutter={[16, 16]} className="page-header">
        <Col span={12}>
          <Title level={2}>Journeys</Title>
          <Text type="secondary">Browse available journeys or create your own</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateJourney}
          >
            Create Journey
          </Button>
        </Col>
      </Row>

      <Card className="journeys-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          tabBarExtraContent={
            <Text>
              {getFilteredJourneys().length} journey{getFilteredJourneys().length !== 1 ? 's' : ''}
            </Text>
          }
        >
          <TabPane tab="All" key="all" />
          <TabPane tab="Upcoming" key="upcoming" />
          <TabPane tab="In Progress" key="in-progress" />
          <TabPane tab="Completed" key="completed" />
          <TabPane tab="Cancelled" key="cancelled" />
        </Tabs>
        
        <List
          itemLayout="horizontal"
          dataSource={getFilteredJourneys()}
          renderItem={renderJourneyItem}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true
          }}
          locale={{
            emptyText: (
              <Empty 
                description="No journeys found" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
        />
      </Card>
    </div>
  );

  const renderCreateJourneyForm = () => (
    <div className="journey-page">
      <Row gutter={[16, 16]} className="page-header">
        <Col span={24}>
          <Button type="link" onClick={() => navigate('/journeys')}>
            &lt; Back to Journeys
          </Button>
          <Title level={2}>Create New Journey</Title>
          <Text type="secondary">Fill in the details for your new journey</Text>
        </Col>
      </Row>

      <Card className="journey-form-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitJourney}
          initialValues={{
            transportType: 'Flight',
            capacity: 10
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Journey Title"
                rules={[{ required: true, message: 'Please enter a title for this journey' }]}
              >
                <Input placeholder="e.g., New York to London" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="departure"
                label="Departure Location"
                rules={[{ required: true, message: 'Please enter the departure location' }]}
              >
                <Input placeholder="e.g., New York, USA" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="destination"
                label="Destination"
                rules={[{ required: true, message: 'Please enter the destination' }]}
              >
                <Input placeholder="e.g., London, UK" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dates"
                label="Journey Dates & Times"
                rules={[{ required: true, message: 'Please select the journey dates' }]}
              >
                <RangePicker 
                  showTime 
                  format="YYYY-MM-DD HH:mm" 
                  style={{ width: '100%' }} 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="transportType"
                label="Transport Type"
                rules={[{ required: true, message: 'Please select the transport type' }]}
              >
                <Select>
                  <Option value="Flight">Flight</Option>
                  <Option value="Train">Train</Option>
                  <Option value="Bus">Bus</Option>
                  <Option value="Car">Car</Option>
                  <Option value="Ship">Ship</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Capacity (Number of Items)"
                rules={[{ required: true, message: 'Please enter capacity' }]}
              >
                <Input type="number" min={1} placeholder="e.g., 10" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="transportationDetails"
                label="Transportation Details (Optional)"
              >
                <Input placeholder="e.g., Flight number BA123" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Additional Notes (Optional)"
          >
            <Input.TextArea rows={4} placeholder="Any additional details about this journey..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Journey
              </Button>
              <Button onClick={() => navigate('/journeys')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );

  // Render the appropriate content based on current route
  if (isNewJourney) {
    return renderCreateJourneyForm();
  } else {
    return renderJourneysList();
  }
};

export default JourneysPage; 