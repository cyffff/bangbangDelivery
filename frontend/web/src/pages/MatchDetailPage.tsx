import React, { useEffect, useState } from 'react';
import { 
  Card, Typography, Button, Space, Tag, Descriptions, Divider, 
  Row, Col, Progress, message, Spin, Modal
} from 'antd';
import { 
  ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import matchingApi, { Match } from '../api/matchingApi';
import { formatDate, formatCurrency, formatWeight, formatVolume } from '../utils/formatters';
import authApi, { UserProfile } from '../api/authApi';

const { Title, Text } = Typography;

interface RouteParams {
  id: string;
  [key: string]: string | undefined;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PROPOSED':
      return 'blue';
    case 'PENDING':
      return 'orange';
    case 'CONFIRMED':
      return 'green';
    case 'COMPLETED':
      return 'purple';
    case 'REJECTED':
      return 'red';
    case 'CANCELLED':
      return 'gray';
    default:
      return 'default';
  }
};

const MatchDetailPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<'demander' | 'traveler' | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await authApi.getCurrentUser();
        setCurrentUser(user);
        
        if (!id) return;
        
        const matchData = await matchingApi.getMatchById(parseInt(id));
        setMatch(matchData);
        
        // Determine user type
        if (matchData.demandUserId === String(user.id)) {
          setUserType('demander');
        } else if (String(matchData.journeyUserId) === String(user.id)) {
          setUserType('traveler');
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
        message.error('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleConfirm = () => {
    if (!match || !userType) return;
    
    Modal.confirm({
      title: 'Confirm Match',
      content: 'Are you sure you want to confirm this match?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          setLoading(true);
          let updatedMatch;
          
          if (userType === 'demander') {
            updatedMatch = await matchingApi.confirmMatchAsDemander(match.id, true);
          } else {
            updatedMatch = await matchingApi.confirmMatchAsTraveler(match.id, true);
          }
          
          setMatch(updatedMatch);
          message.success('Match confirmed successfully');
        } catch (error) {
          console.error('Error confirming match:', error);
          message.error('Failed to confirm match');
        } finally {
          setLoading(false);
        }
      }
    });
  };
  
  const handleReject = () => {
    if (!match || !userType) return;
    
    Modal.confirm({
      title: 'Reject Match',
      content: 'Are you sure you want to reject this match?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          let updatedMatch;
          
          if (userType === 'demander') {
            updatedMatch = await matchingApi.confirmMatchAsDemander(match.id, false);
          } else {
            updatedMatch = await matchingApi.confirmMatchAsTraveler(match.id, false);
          }
          
          setMatch(updatedMatch);
          message.success('Match rejected');
        } catch (error) {
          console.error('Error rejecting match:', error);
          message.error('Failed to reject match');
        } finally {
          setLoading(false);
        }
      }
    });
  };
  
  const handleCancel = () => {
    if (!match) return;
    
    Modal.confirm({
      title: 'Cancel Match',
      content: 'Are you sure you want to cancel this match? This cannot be undone.',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          const updatedMatch = await matchingApi.cancelMatch(match.id);
          setMatch(updatedMatch);
          message.success('Match cancelled');
        } catch (error) {
          console.error('Error cancelling match:', error);
          message.error('Failed to cancel match');
        } finally {
          setLoading(false);
        }
      }
    });
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!match || !userType || !currentUser) {
    return (
      <div style={{ margin: '40px 20px' }}>
        <Title level={4}>Match not found or you don't have permission to view it</Title>
        <Button type="primary" onClick={() => navigate('/matches')}>
          Go back to matches
        </Button>
      </div>
    );
  }
  
  const { demand, journey, status, matchScore } = match;
  const isPending = status === 'PROPOSED' || status === 'PENDING';
  const isConfirmed = status === 'CONFIRMED';
  const isDemanderConfirmed = match.demanderConfirmed;
  const isTravelerConfirmed = match.travelerConfirmed;
  const hasConfirmed = userType === 'demander' ? isDemanderConfirmed : isTravelerConfirmed;
  
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Button 
        type="default" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/matches')}
        style={{ marginBottom: 16 }}
      >
        Back to Matches
      </Button>
      
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>
            Match Details 
            <Tag 
              color={getStatusColor(status)} 
              style={{ marginLeft: 16, fontSize: 14 }}
            >
              {status}
            </Tag>
          </Title>
          
          <div style={{ textAlign: 'center' }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Match Score</Text>
            <Progress 
              type="circle" 
              percent={Math.round(matchScore * 100)} 
              format={percent => `${percent}%`}
              status={matchScore > 0.7 ? 'success' : matchScore > 0.5 ? 'normal' : 'exception'}
              width={80}
            />
          </div>
        </div>
        
        <Divider />
        
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card title="Demand Information" bordered={false}>
              <Descriptions column={1}>
                <Descriptions.Item label="Title">{demand.title}</Descriptions.Item>
                <Descriptions.Item label="Item Type">{demand.itemType}</Descriptions.Item>
                <Descriptions.Item label="Weight">{formatWeight(demand.weightKg)}</Descriptions.Item>
                <Descriptions.Item label="Estimated Value">{formatCurrency(demand.estimatedValue)}</Descriptions.Item>
                <Descriptions.Item label="Route">
                  {demand.originCity}, {demand.originCountry} → 
                  {demand.destinationCity}, {demand.destinationCountry}
                </Descriptions.Item>
                <Descriptions.Item label="Deadline">{formatDate(demand.deadline)}</Descriptions.Item>
                <Descriptions.Item label="Reward">{formatCurrency(demand.rewardAmount)}</Descriptions.Item>
                {demand.description && (
                  <Descriptions.Item label="Description">{demand.description}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="Journey Information" bordered={false}>
              <Descriptions column={1}>
                <Descriptions.Item label="Route">
                  {journey.fromCity}, {journey.fromCountry} → 
                  {journey.toCity}, {journey.toCountry}
                </Descriptions.Item>
                <Descriptions.Item label="Departure Date">{formatDate(journey.departureDate)}</Descriptions.Item>
                <Descriptions.Item label="Arrival Date">{formatDate(journey.arrivalDate)}</Descriptions.Item>
                <Descriptions.Item label="Available Weight">{formatWeight(journey.availableWeight)}</Descriptions.Item>
                <Descriptions.Item label="Available Volume">{formatVolume(journey.availableVolume)}</Descriptions.Item>
                {journey.preferredItemTypes && journey.preferredItemTypes.length > 0 && (
                  <Descriptions.Item label="Preferred Item Types">
                    {journey.preferredItemTypes.map(type => (
                      <Tag key={type} style={{ margin: '0 4px 4px 0' }}>{type}</Tag>
                    ))}
                  </Descriptions.Item>
                )}
                {journey.notes && (
                  <Descriptions.Item label="Notes">{journey.notes}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <Row>
          <Col span={24}>
            <Card title="Match Status" bordered={false}>
              <Row>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                    <div style={{ width: 120 }}>Demander:</div>
                    <Tag 
                      icon={isDemanderConfirmed ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                      color={isDemanderConfirmed ? 'green' : 'orange'}
                    >
                      {isDemanderConfirmed ? 'Confirmed' : 'Pending'}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                    <div style={{ width: 120 }}>Traveler:</div>
                    <Tag 
                      icon={isTravelerConfirmed ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                      color={isTravelerConfirmed ? 'green' : 'orange'}
                    >
                      {isTravelerConfirmed ? 'Confirmed' : 'Pending'}
                    </Tag>
                  </div>
                </Col>
              </Row>
              
              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                    <div style={{ width: 120 }}>Match Created:</div>
                    <span>{formatDate(match.matchedAt)}</span>
                  </div>
                  
                  {match.confirmedAt && (
                    <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                      <div style={{ width: 120 }}>Confirmed At:</div>
                      <span>{formatDate(match.confirmedAt)}</span>
                    </div>
                  )}
                  
                  {match.rejectedAt && (
                    <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                      <div style={{ width: 120 }}>Rejected At:</div>
                      <span>{formatDate(match.rejectedAt)}</span>
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            {isPending && !hasConfirmed && (
              <>
                <Button 
                  danger 
                  icon={<CloseCircleOutlined />} 
                  onClick={handleReject}
                >
                  Reject Match
                </Button>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  onClick={handleConfirm}
                >
                  Confirm Match
                </Button>
              </>
            )}
            
            {isPending && hasConfirmed && (
              <Text type="secondary">
                Waiting for {userType === 'demander' ? 'traveler' : 'demander'} confirmation
              </Text>
            )}
            
            {isConfirmed && (
              <Button 
                danger 
                onClick={handleCancel}
              >
                Cancel Match
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default MatchDetailPage; 