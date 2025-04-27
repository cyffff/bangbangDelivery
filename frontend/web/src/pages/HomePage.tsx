import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Tag, Space, Input, Select, Pagination, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined, FilterOutlined, RocketOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// Mock data for tasks
const MOCK_TASKS = [
  {
    id: '1',
    title: 'Vitamins and Supplements from San Francisco',
    itemType: 'Medicine',
    originCity: 'San Francisco',
    originCountry: 'USA',
    destinationCity: 'Shanghai',
    destinationCountry: 'China',
    weight: 2.5,
    size: '25 × 15 × 10 cm',
    deliveryMethod: 'Meet in person',
    createdAt: '2023-04-24T10:30:00Z',
    reward: 80,
    status: 'pending'
  },
  {
    id: '2',
    title: 'Specialty Coffee Beans from Seattle',
    itemType: 'Food',
    originCity: 'Seattle',
    originCountry: 'USA',
    destinationCity: 'Tokyo',
    destinationCountry: 'Japan',
    weight: 1.8,
    size: '20 × 15 × 8 cm',
    deliveryMethod: 'Meet in person',
    createdAt: '2023-04-23T14:45:00Z',
    reward: 50,
    status: 'pending'
  },
  {
    id: '3',
    title: 'Apple MacBook Pro Laptop',
    itemType: 'Electronics',
    originCity: 'New York',
    originCountry: 'USA',
    destinationCity: 'Dubai',
    destinationCountry: 'UAE',
    weight: 3.2,
    size: '35 × 25 × 6 cm',
    deliveryMethod: 'Courier',
    createdAt: '2023-04-22T09:15:00Z',
    reward: 150,
    status: 'pending'
  },
  {
    id: '4',
    title: 'Designer Handbag from Paris',
    itemType: 'Other',
    originCity: 'Paris',
    originCountry: 'France',
    destinationCity: 'Beijing',
    destinationCountry: 'China',
    weight: 1.5,
    size: '40 × 30 × 20 cm',
    deliveryMethod: 'Home Delivery',
    createdAt: '2023-04-21T16:30:00Z',
    reward: 120,
    status: 'pending'
  },
  {
    id: '5',
    title: 'Business Documents Package',
    itemType: 'Documents',
    originCity: 'London',
    originCountry: 'UK',
    destinationCity: 'Singapore',
    destinationCountry: 'Singapore',
    weight: 0.8,
    size: '30 × 21 × 3 cm',
    deliveryMethod: 'Meet in person',
    createdAt: '2023-04-20T11:00:00Z',
    reward: 70,
    status: 'pending'
  },
  {
    id: '6',
    title: 'Baby Formula from Australia',
    itemType: 'Food',
    originCity: 'Sydney',
    originCountry: 'Australia',
    destinationCity: 'Hong Kong',
    destinationCountry: 'China',
    weight: 4.0,
    size: '45 × 35 × 25 cm',
    deliveryMethod: 'Courier',
    createdAt: '2023-04-19T08:45:00Z',
    reward: 90,
    status: 'pending'
  }
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(MOCK_TASKS);
      setTotalTasks(MOCK_TASKS.length);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    // In a real app, this would trigger an API call with search params
  };

  const handleItemTypeChange = (value: string) => {
    setItemTypeFilter(value);
    setCurrentPage(1);
    // In a real app, this would trigger an API call with filter params
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, this would trigger an API call with pagination params
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'Food':
        return 'green';
      case 'Medicine':
        return 'blue';
      case 'Documents':
        return 'gold';
      case 'Electronics':
        return 'purple';
      case 'Jewelry':
        return 'magenta';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <div className="hero-section">
        <Title level={1}>International Delivery Made Easy</Title>
        <Paragraph>
          Connect with travelers to deliver your items internationally.
          Save time and money on cross-border shipping.
        </Paragraph>
        <Button type="primary" size="large" icon={<RocketOutlined />}>
          <Link to="/create-task">Post a Delivery Request</Link>
        </Button>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input
              placeholder="Search delivery requests"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} md={7}>
            <Select
              placeholder="Filter by item type"
              style={{ width: '100%' }}
              onChange={handleItemTypeChange}
              value={itemTypeFilter || undefined}
              size="large"
              allowClear
            >
              <Option value="Food">Food</Option>
              <Option value="Medicine">Medicine</Option>
              <Option value="Documents">Documents</Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Jewelry">Jewelry</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Col>
          <Col xs={24} md={7}>
            <Select
              placeholder="Sort by"
              style={{ width: '100%' }}
              defaultValue="newest"
              size="large"
            >
              <Option value="newest">Newest First</Option>
              <Option value="reward">Highest Reward</Option>
              <Option value="weight">Lowest Weight</Option>
            </Select>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : tasks.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {tasks.map((task) => (
              <Col xs={24} sm={12} lg={8} key={task.id}>
                <Card 
                  hoverable 
                  className="task-card"
                  actions={[
                    <Link to={`/task/${task.id}`} key="details">View Details</Link>
                  ]}
                >
                  <div className="card-title">{task.title}</div>
                  <div>
                    <Tag color={getItemTypeColor(task.itemType)} className="card-tag">
                      {task.itemType}
                    </Tag>
                    <Tag color="default" className="card-tag">
                      {task.weight} kg
                    </Tag>
                  </div>
                  <div style={{ margin: '16px 0' }}>
                    <Space direction="vertical" size={2}>
                      <Text type="secondary">
                        <EnvironmentOutlined /> {task.originCity}, {task.originCountry} → {task.destinationCity}, {task.destinationCountry}
                      </Text>
                      <Text type="secondary">
                        <CalendarOutlined /> Posted on {formatDate(task.createdAt)}
                      </Text>
                    </Space>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Reward: ${task.reward}</Text>
                    <Text>{task.deliveryMethod}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Pagination 
              current={currentPage}
              pageSize={pageSize}
              total={totalTasks}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty 
          description="No delivery requests found" 
          style={{ margin: '40px 0' }}
        />
      )}
    </div>
  );
};

export default HomePage; 