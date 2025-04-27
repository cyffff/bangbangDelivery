import React, { useState, useEffect } from 'react';
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
  Progress,
  Dropdown,
  Menu,
  Badge,
  Empty,
  Rate
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  EnvironmentOutlined,
  UserOutlined,
  EllipsisOutlined,
  MessageOutlined,
  FileTextOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  origin: string;
  destination: string;
  offerCount: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  itemType: string;
  weight: string;
  dimensions: string;
  traveler?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  progress?: number;
  estimatedDeliveryDate?: string;
}

const mockMyTasks: TaskItem[] = [
  {
    id: 't1',
    title: 'Small electronics package',
    status: 'active',
    origin: 'New York, USA',
    destination: 'London, UK',
    offerCount: 3,
    price: 35,
    createdAt: '2023-12-01',
    updatedAt: '2023-12-05',
    description: 'Small box with a USB device. Well packaged, not fragile.',
    itemType: 'Electronics',
    weight: '0.5kg',
    dimensions: '15cm x 10cm x 5cm',
    traveler: {
      id: 'u1',
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 4.8
    },
    progress: 60,
    estimatedDeliveryDate: '2023-12-20'
  },
  {
    id: 't2',
    title: 'Clothing items for my sister',
    status: 'pending',
    origin: 'Los Angeles, USA',
    destination: 'Paris, France',
    offerCount: 2,
    price: 45,
    createdAt: '2023-12-03',
    updatedAt: '2023-12-03',
    description: 'Two dresses and a pair of shoes. Nothing fragile.',
    itemType: 'Clothing',
    weight: '2kg',
    dimensions: '40cm x 30cm x 15cm'
  },
  {
    id: 't3',
    title: 'Birthday gift for my brother',
    status: 'completed',
    origin: 'Chicago, USA',
    destination: 'Berlin, Germany',
    offerCount: 5,
    price: 50,
    createdAt: '2023-11-10',
    updatedAt: '2023-12-01',
    description: 'Gift-wrapped box with headphones.',
    itemType: 'Gift',
    weight: '1kg',
    dimensions: '20cm x 20cm x 10cm',
    traveler: {
      id: 'u2',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 4.9
    },
    progress: 100,
    estimatedDeliveryDate: '2023-11-28'
  },
  {
    id: 't4',
    title: 'Documents for my university application',
    status: 'cancelled',
    origin: 'Toronto, Canada',
    destination: 'Sydney, Australia',
    offerCount: 1,
    price: 30,
    createdAt: '2023-11-15',
    updatedAt: '2023-11-20',
    description: 'Envelope with university application documents.',
    itemType: 'Documents',
    weight: '0.2kg',
    dimensions: '30cm x 21cm x 1cm'
  }
];

const MyTasksPage: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFilteredTasks(mockMyTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    setLoading(true);
    
    // Filter tasks based on tab
    setTimeout(() => {
      if (key === 'all') {
        setFilteredTasks(mockMyTasks);
      } else {
        setFilteredTasks(mockMyTasks.filter(task => task.status === key));
      }
      setLoading(false);
    }, 500);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Pending Offers</Tag>;
      case 'active':
        return <Tag icon={<ClockCircleOutlined />} color="processing">In Transit</Tag>;
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>;
      case 'cancelled':
        return <Tag icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>;
      default:
        return null;
    }
  };

  const renderTaskItem = (task: TaskItem) => {
    const actions = [];
    
    // Add actions based on task status
    if (task.status === 'pending') {
      actions.push(
        <Link to={`/task/${task.id}`} key="view">
          <Button type="primary">View Offers ({task.offerCount})</Button>
        </Link>
      );
      actions.push(
        <Dropdown 
          key="more"
          overlay={
            <Menu>
              <Menu.Item key="edit">Edit Task</Menu.Item>
              <Menu.Item key="cancel">Cancel Task</Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      );
    } else if (task.status === 'active') {
      actions.push(
        <Link to={`/task/${task.id}`} key="view">
          <Button type="primary">Track Delivery</Button>
        </Link>
      );
      actions.push(
        <Link to={`/messages/${task.traveler?.id}`} key="message">
          <Button icon={<MessageOutlined />}>Message</Button>
        </Link>
      );
    } else if (task.status === 'completed') {
      actions.push(
        <Link to={`/task/${task.id}`} key="view">
          <Button type="default">View Details</Button>
        </Link>
      );
      actions.push(
        <Link to={`/review/create/${task.id}`} key="review">
          <Button type="primary">Write Review</Button>
        </Link>
      );
    }

    return (
      <List.Item
        key={task.id}
        actions={actions}
      >
        <Card 
          style={{ width: '100%', borderRadius: '8px' }} 
          bodyStyle={{ padding: '16px' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <div style={{ marginBottom: '12px' }}>
                <Space size="middle">
                  <Link to={`/task/${task.id}`}>
                    <Title level={4} style={{ margin: 0 }}>{task.title}</Title>
                  </Link>
                  {getStatusTag(task.status)}
                </Space>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <EnvironmentOutlined style={{ color: '#1890ff' }} />
                    <Text strong>From:</Text>
                    <Text>{task.origin}</Text>
                  </Space>
                  <Space>
                    <EnvironmentOutlined style={{ color: '#52c41a' }} />
                    <Text strong>To:</Text>
                    <Text>{task.destination}</Text>
                  </Space>
                </Space>
              </div>
              
              <Space>
                <Tag color="blue">{task.itemType}</Tag>
                <Tag>{task.weight}</Tag>
                <Tag>{task.dimensions}</Tag>
                <Tag color="green">${task.price}</Tag>
              </Space>
              
              {task.status === 'active' && task.progress && (
                <div style={{ marginTop: '12px' }}>
                  <Text strong>Delivery Progress:</Text>
                  <Progress percent={task.progress} size="small" />
                  {task.estimatedDeliveryDate && (
                    <Text type="secondary">
                      Estimated delivery: {task.estimatedDeliveryDate}
                    </Text>
                  )}
                </div>
              )}
            </Col>
            
            <Col xs={24} md={8}>
              {task.traveler ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Text strong style={{ marginBottom: '8px' }}>
                    {task.status === 'active' ? 'Current Carrier' : 'Delivered by'}
                  </Text>
                  <Avatar 
                    size={64} 
                    src={task.traveler.avatar} 
                    icon={<UserOutlined />}
                  />
                  <Text style={{ margin: '8px 0' }}>{task.traveler.name}</Text>
                  <Rate disabled defaultValue={task.traveler.rating} style={{ fontSize: '12px' }} />
                </div>
              ) : task.status === 'pending' ? (
                <div style={{ textAlign: 'center' }}>
                  <Badge count={task.offerCount} style={{ backgroundColor: '#1890ff' }}>
                    <Avatar shape="square" size={64} icon={<FileTextOutlined />} />
                  </Badge>
                  <Text style={{ display: 'block', marginTop: '8px' }}>
                    {task.offerCount} {task.offerCount === 1 ? 'offer' : 'offers'} available
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Created on {task.createdAt}
                  </Text>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">
                    Task {task.status === 'cancelled' ? 'cancelled' : 'completed'} on {task.updatedAt}
                  </Text>
                </div>
              )}
            </Col>
          </Row>
        </Card>
      </List.Item>
    );
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>My Tasks</Title>
        <Link to="/task/create">
          <Button type="primary" size="large">
            Create New Task
          </Button>
        </Link>
      </div>

      <Tabs 
        activeKey={activeTabKey} 
        onChange={handleTabChange}
        type="card"
        size="large"
      >
        <TabPane tab="All Tasks" key="all">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={filteredTasks}
            renderItem={renderTaskItem}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true
            }}
            locale={{
              emptyText: <Empty description="You don't have any tasks yet" />
            }}
          />
        </TabPane>
        <TabPane tab="Pending" key="pending">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={filteredTasks}
            renderItem={renderTaskItem}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true
            }}
            locale={{
              emptyText: <Empty description="You don't have any pending tasks" />
            }}
          />
        </TabPane>
        <TabPane tab="Active" key="active">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={filteredTasks}
            renderItem={renderTaskItem}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true
            }}
            locale={{
              emptyText: <Empty description="You don't have any active tasks" />
            }}
          />
        </TabPane>
        <TabPane tab="Completed" key="completed">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={filteredTasks}
            renderItem={renderTaskItem}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true
            }}
            locale={{
              emptyText: <Empty description="You don't have any completed tasks" />
            }}
          />
        </TabPane>
        <TabPane tab="Cancelled" key="cancelled">
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={filteredTasks}
            renderItem={renderTaskItem}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true
            }}
            locale={{
              emptyText: <Empty description="You don't have any cancelled tasks" />
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MyTasksPage; 