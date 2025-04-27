import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  Row, 
  Col, 
  Empty, 
  Spin, 
  Alert,
  Tabs,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  GlobalOutlined, 
  FileTextOutlined, 
  UserOutlined,
  FireOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllDemands, 
  fetchUserDemands,
  setFilter, 
  selectFilteredDemands, 
  selectDemandLoading, 
  selectDemandError, 
  selectDemandFilter,
  clearError,
  DeliveryDemand 
} from '../store/slices/demandSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Status color mapping
const statusColors = {
  PENDING: 'blue',
  ACCEPTED: 'orange',
  IN_TRANSIT: 'purple',
  DELIVERED: 'green',
  CANCELLED: 'red'
};

const DemandListPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const demands = useSelector(selectFilteredDemands);
  const loading = useSelector(selectDemandLoading);
  const error = useSelector(selectDemandError);
  const filter = useSelector(selectDemandFilter);
  
  // Local state for search
  const [searchText, setSearchText] = useState('');
  const [filteredDemands, setFilteredDemands] = useState<DeliveryDemand[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Load demands on component mount
  useEffect(() => {
    // If on "my-demands" tab, load user's demands
    if (activeTab === 'my-demands' && isAuthenticated && currentUser) {
      dispatch(fetchUserDemands(currentUser.id.toString()) as any);
    } else {
      dispatch(fetchAllDemands() as any);
    }
  }, [dispatch, activeTab, isAuthenticated, currentUser]);

  // Filter demands based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredDemands(demands);
      return;
    }
    
    const searchLower = searchText.toLowerCase();
    const result = demands.filter(
      demand => 
        demand.title.toLowerCase().includes(searchLower) ||
        demand.originCity.toLowerCase().includes(searchLower) ||
        demand.originCountry.toLowerCase().includes(searchLower) ||
        demand.destinationCity.toLowerCase().includes(searchLower) ||
        demand.destinationCountry.toLowerCase().includes(searchLower) ||
        demand.itemType.toLowerCase().includes(searchLower)
    );
    
    setFilteredDemands(result);
  }, [demands, searchText]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Reset search
    setSearchText('');
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (value: any) => {
    dispatch(setFilter(value));
  };

  const handleViewDemand = (id: string) => {
    navigate(`/demands/${id}`);
  };

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: DeliveryDemand) => (
        <div>
          <Text strong style={{ cursor: 'pointer' }} onClick={() => handleViewDemand(record.id)}>
            {text}
          </Text>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.itemType} • {record.weightKg} kg
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Route',
      key: 'route',
      render: (_: any, record: DeliveryDemand) => (
        <div>
          <Text>
            <GlobalOutlined style={{ marginRight: 4 }} />
            {record.originCity}, {record.originCountry}
          </Text>
          <div style={{ margin: '4px 0', fontSize: '12px' }}>↓</div>
          <Text>
            <GlobalOutlined style={{ marginRight: 4 }} />
            {record.destinationCity}, {record.destinationCountry}
          </Text>
        </div>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => (
        <Text>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Reward',
      dataIndex: 'rewardAmount',
      key: 'rewardAmount',
      render: (amount: number) => (
        <Text strong style={{ color: '#389e0d' }}>
          ${amount}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DeliveryDemand) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleViewDemand(record.id)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

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
        <Row align="middle" justify="space-between" gutter={16}>
          <Col>
            <Title level={2} style={{ marginBottom: 0 }}>
              {t('demand.list.title')}
            </Title>
            <Paragraph type="secondary">
              {t('demand.list.subtitle')}
            </Paragraph>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              onClick={() => navigate('/demands/create')}
            >
              Create Demand
            </Button>
          </Col>
        </Row>
      </Card>

      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        style={{ marginBottom: 16 }}
      >
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              All Demands
            </span>
          } 
          key="all" 
        />
        {isAuthenticated && (
          <TabPane 
            tab={
              <span>
                <UserOutlined />
                My Demands
              </span>
            } 
            key="my-demands" 
          />
        )}
        <TabPane 
          tab={
            <span>
              <FireOutlined />
              <Badge dot={true} offset={[2, 0]}>
                Popular
              </Badge>
            </span>
          } 
          key="popular" 
        />
      </Tabs>

      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}
      >
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 16 }}
            closable
            onClose={() => dispatch(clearError())}
          />
        )}

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col md={16} xs={24} style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search demands by title, location, item type..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
            />
          </Col>
          <Col md={8} xs={24}>
            <Select
              style={{ width: '100%' }}
              value={filter}
              onChange={handleFilterChange}
            >
              {statusFilterOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredDemands.length === 0 ? (
          <Empty 
            description="No demands found" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        ) : (
          <Table 
            columns={columns} 
            dataSource={filteredDemands} 
            rowKey="id"
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true, 
              showTotal: total => `Total ${total} items` 
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default DemandListPage; 