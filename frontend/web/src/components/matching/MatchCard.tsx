import React from 'react';
import { Card, Typography, Tag, Button, Space, Descriptions, Progress, Row, Col, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Match } from '../../api/matchingApi';
import { formatDate } from '../../utils/formatters';

const { Title, Text } = Typography;

interface MatchCardProps {
  match: Match;
  userType: 'demander' | 'traveler';
  onConfirm?: (matchId: number) => void;
  onReject?: (matchId: number) => void;
  expanded?: boolean;
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

const MatchCard: React.FC<MatchCardProps> = ({ match, userType, onConfirm, onReject, expanded = false }) => {
  const { demand, journey, status, matchScore } = match;
  
  const isPending = status === 'PROPOSED' || status === 'PENDING';
  const isDemanderConfirmed = match.demanderConfirmed;
  const isTravelerConfirmed = match.travelerConfirmed;
  
  // Check if current user has already confirmed
  const hasConfirmed = userType === 'demander' ? isDemanderConfirmed : isTravelerConfirmed;
  
  return (
    <Card 
      hoverable
      style={{ marginBottom: 16 }}
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={5}>
              {userType === 'demander' 
                ? `Journey: ${journey.fromCity} → ${journey.toCity}` 
                : `Demand: ${demand.title}`}
            </Title>
          </Col>
          <Col>
            <Tag color={getStatusColor(status)}>{status}</Tag>
          </Col>
        </Row>
      }
    >
      <Row gutter={16}>
        <Col span={16}>
          {userType === 'demander' ? (
            // Show journey details to demander
            <>
              <Text strong>Journey Details:</Text>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Route">
                  {journey.fromCity}, {journey.fromCountry} → {journey.toCity}, {journey.toCountry}
                </Descriptions.Item>
                <Descriptions.Item label="Dates">
                  {formatDate(journey.departureDate)} - {formatDate(journey.arrivalDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Available Weight">
                  {journey.availableWeight}kg
                </Descriptions.Item>
                {expanded && (
                  <>
                    <Descriptions.Item label="Available Volume">
                      {journey.availableVolume}m³
                    </Descriptions.Item>
                    <Descriptions.Item label="Notes">
                      {journey.notes || 'No notes provided'}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </>
          ) : (
            // Show demand details to traveler
            <>
              <Text strong>Demand Details:</Text>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Item Type">
                  {demand.itemType}
                </Descriptions.Item>
                <Descriptions.Item label="Weight">
                  {demand.weightKg}kg
                </Descriptions.Item>
                <Descriptions.Item label="Route">
                  {demand.originCity}, {demand.originCountry} → {demand.destinationCity}, {demand.destinationCountry}
                </Descriptions.Item>
                {expanded && (
                  <>
                    <Descriptions.Item label="Deadline">
                      {formatDate(demand.deadline)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Reward">
                      ${demand.rewardAmount}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                      {demand.description || 'No description provided'}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </>
          )}
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Text strong>Match Score</Text>
            <Progress 
              type="circle" 
              percent={Math.round(matchScore * 100)} 
              format={percent => `${percent}%`}
              status={matchScore > 0.7 ? 'success' : matchScore > 0.5 ? 'normal' : 'exception'}
              width={80}
            />
          </div>
          
          {expanded && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Confirmation Status:</Text>
              <div style={{ marginTop: 8 }}>
                <Tag 
                  icon={isDemanderConfirmed ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                  color={isDemanderConfirmed ? 'green' : 'orange'}
                >
                  Demander: {isDemanderConfirmed ? 'Confirmed' : 'Pending'}
                </Tag>
              </div>
              <div style={{ marginTop: 8 }}>
                <Tag 
                  icon={isTravelerConfirmed ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                  color={isTravelerConfirmed ? 'green' : 'orange'}
                >
                  Traveler: {isTravelerConfirmed ? 'Confirmed' : 'Pending'}
                </Tag>
              </div>
            </div>
          )}
        </Col>
      </Row>
      
      {isPending && (
        <>
          <Divider />
          <Row justify="end">
            <Space>
              {!hasConfirmed && onReject && (
                <Button 
                  danger 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => onReject(match.id)}
                >
                  Reject
                </Button>
              )}
              {!hasConfirmed && onConfirm && (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => onConfirm(match.id)}
                >
                  Confirm
                </Button>
              )}
              {hasConfirmed && (
                <Text type="secondary">Waiting for {userType === 'demander' ? 'traveler' : 'demander'} confirmation</Text>
              )}
            </Space>
          </Row>
        </>
      )}
    </Card>
  );
};

export default MatchCard; 