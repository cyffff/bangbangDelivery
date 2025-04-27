import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Typography, 
  Space, 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Divider, 
  Descriptions, 
  Modal, 
  message,
  Spin,
  Tabs,
  Avatar
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { getJourneyById, deleteJourney, cancelJourney, completeJourney, getMatchingDemandsForJourney } from '../api/journeyApi';
import { Journey, JourneyStatus } from '../types/Journey';
import { RootState } from '../store';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface User {
  id: string;
  username: string;
  // Add other user properties as needed
}

const JourneyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = useSelector((state: RootState) => state.auth.user) as User | null;
  
  const [journey, setJourney] = useState<Journey | null>(null);
  const [matchingDemands, setMatchingDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionsLoading, setActionsLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchJourneyDetails(id);
    }
  }, [id]);
  
  const fetchJourneyDetails = async (journeyId: string) => {
    try {
      setLoading(true);
      const data = await getJourneyById(journeyId);
      setJourney(data);
      
      // Fetch matching demands if the journey is owned by current user
      if (currentUser && data.userId === currentUser.id) {
        fetchMatchingDemands(journeyId);
      }
    } catch (error) {
      console.error('Failed to fetch journey details:', error);
      message.error(t('journey.fetchError') as string);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMatchingDemands = async (journeyId: string) => {
    try {
      const data = await getMatchingDemandsForJourney(journeyId);
      setMatchingDemands(data);
    } catch (error) {
      console.error('Failed to fetch matching demands:', error);
    }
  };
  
  const handleEdit = () => {
    navigate(`/journeys/edit/${id}`);
  };
  
  const handleDeleteConfirm = () => {
    confirm({
      title: t('journey.deleteConfirmTitle') as string,
      icon: <ExclamationCircleOutlined />,
      content: t('journey.deleteConfirmContent') as string,
      okText: t('common.yes') as string,
      okType: 'danger',
      cancelText: t('common.no') as string,
      onOk: handleDelete,
    });
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setActionsLoading(true);
      await deleteJourney(id);
      message.success(t('journey.deleteSuccess') as string);
      navigate('/journeys');
    } catch (error) {
      console.error('Failed to delete journey:', error);
      message.error(t('journey.deleteError') as string);
    } finally {
      setActionsLoading(false);
    }
  };
  
  const handleCancel = async () => {
    if (!id) return;
    
    try {
      setActionsLoading(true);
      const updatedJourney = await cancelJourney(id);
      setJourney(updatedJourney);
      message.success(t('journey.cancelSuccess') as string);
    } catch (error) {
      console.error('Failed to cancel journey:', error);
      message.error(t('journey.cancelError') as string);
    } finally {
      setActionsLoading(false);
    }
  };
  
  const handleComplete = async () => {
    if (!id) return;
    
    try {
      setActionsLoading(true);
      const updatedJourney = await completeJourney(id);
      setJourney(updatedJourney);
      message.success(t('journey.completeSuccess') as string);
    } catch (error) {
      console.error('Failed to complete journey:', error);
      message.error(t('journey.completeError') as string);
    } finally {
      setActionsLoading(false);
    }
  };
  
  const renderStatusTag = (status: JourneyStatus) => {
    let color = '';
    let icon = null;
    
    switch (status) {
      case JourneyStatus.ACTIVE:
        color = 'green';
        icon = <CheckCircleOutlined />;
        break;
      case JourneyStatus.ONGOING:
        color = 'blue';
        icon = <CalendarOutlined />;
        break;
      case JourneyStatus.COMPLETED:
        color = 'default';
        icon = <CheckCircleOutlined />;
        break;
      case JourneyStatus.CANCELLED:
        color = 'red';
        icon = <CloseCircleOutlined />;
        break;
      default:
        color = 'default';
    }
    
    return (
      <Tag color={color} icon={icon}>
        {t(`journey.status.${status}`) as string}
      </Tag>
    );
  };
  
  const renderActionButtons = () => {
    if (!journey || !currentUser || journey.userId !== currentUser.id) {
      return null;
    }
    
    return (
      <Space>
        {journey.status === JourneyStatus.ACTIVE && (
          <>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
              loading={actionsLoading}
            >
              {t('common.edit') as string}
            </Button>
            <Button 
              danger 
              icon={<CloseCircleOutlined />} 
              onClick={handleCancel}
              loading={actionsLoading}
            >
              {t('common.cancel') as string}
            </Button>
          </>
        )}
        
        {journey.status === JourneyStatus.ONGOING && (
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={handleComplete}
            loading={actionsLoading}
          >
            {t('journey.markComplete') as string}
          </Button>
        )}
        
        {(journey.status === JourneyStatus.ACTIVE || journey.status === JourneyStatus.CANCELLED) && (
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleDeleteConfirm}
            loading={actionsLoading}
          >
            {t('common.delete') as string}
          </Button>
        )}
      </Space>
    );
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!journey) {
    return (
      <Card>
        <Text>{t('journey.notFound') as string}</Text>
      </Card>
    );
  }
  
  return (
    <div>
      <Card>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col>
            <Space align="center" size="large">
              <Title level={2}>{t('journey.details') as string}</Title>
              {renderStatusTag(journey.status)}
            </Space>
          </Col>
          <Col>
            {renderActionButtons()}
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Card title={t('journey.routeInfo') as string} bordered={false}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Row gutter={16} align="middle">
                  <Col span={10}>
                    <Space>
                      <EnvironmentOutlined />
                      <Text strong>{journey.departureCity}, {journey.departureCountry}</Text>
                    </Space>
                  </Col>
                  <Col span={4} style={{ textAlign: 'center' }}>
                    <ArrowRightOutlined style={{ fontSize: '24px' }} />
                  </Col>
                  <Col span={10}>
                    <Space>
                      <EnvironmentOutlined />
                      <Text strong>{journey.destinationCity}, {journey.destinationCountry}</Text>
                    </Space>
                  </Col>
                </Row>
                
                <Descriptions column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label={t('journey.departureDate') as string}>
                    {dayjs(journey.departureDate).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('journey.arrivalDate') as string}>
                    {dayjs(journey.arrivalDate).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('journey.availableWeight') as string}>
                    {journey.availableWeightKg} kg
                  </Descriptions.Item>
                  <Descriptions.Item label={t('journey.createdAt') as string}>
                    {dayjs(journey.createdAt).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                </Descriptions>
                
                {journey.preferredItemTypes && journey.preferredItemTypes.length > 0 && (
                  <div>
                    <Text strong>{t('journey.preferredItemTypes') as string}: </Text>
                    <div style={{ marginTop: 8 }}>
                      {journey.preferredItemTypes.map(type => (
                        <Tag key={type} icon={<ShoppingOutlined />}>
                          {t(`itemTypes.${type}`) as string}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
                
                {journey.notes && (
                  <div>
                    <Text strong>{t('journey.notes') as string}: </Text>
                    <Paragraph>{journey.notes}</Paragraph>
                  </div>
                )}
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card title={t('journey.travelerInfo') as string} bordered={false}>
              {journey.user && (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center', margin: '16px 0' }}>
                    <Avatar 
                      size={64} 
                      src={journey.user.profileImageUrl}
                      icon={<UserOutlined />}
                    />
                    <Title level={4} style={{ marginTop: 8 }}>
                      {journey.user.username}
                    </Title>
                  </div>
                  
                  <Divider />
                  
                  <Descriptions column={1}>
                    <Descriptions.Item label={t('user.creditScore') as string}>
                      {journey.user.creditScore}
                    </Descriptions.Item>
                  </Descriptions>
                  
                  {currentUser && journey.userId !== currentUser.id && (
                    <Button 
                      type="primary" 
                      block
                      onClick={() => navigate(`/messages/user/${journey.userId}`)}
                    >
                      {t('common.contactUser') as string}
                    </Button>
                  )}
                </Space>
              )}
            </Card>
          </Col>
        </Row>
        
        {currentUser && journey.userId === currentUser.id && matchingDemands.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Card title={t('journey.matchingDemands') as string}>
              {/* Render matching demands here */}
              <Text>{t('journey.matchingDemandsCount', { count: matchingDemands.length }) as string}</Text>
              
              {/* You would render a list of matching demands here, similar to JourneyList */}
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JourneyDetailPage; 