import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Space, Button, Row, Col, Empty, Spin, Typography, Avatar, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  GlobalOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Journey, JourneyStatus } from '../../types/Journey';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface JourneyListProps {
  journeys: Journey[];
  loading?: boolean;
  onJourneyClick?: (journey: Journey) => void;
  total?: number;
  pageSize?: number;
  current?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  emptyText?: string;
}

const JourneyList: React.FC<JourneyListProps> = ({
  journeys,
  loading = false,
  onJourneyClick,
  total = 0,
  pageSize = 10,
  current = 1,
  onPageChange,
  emptyText
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusColor = (status: JourneyStatus) => {
    switch (status) {
      case JourneyStatus.ACTIVE:
        return 'green';
      case JourneyStatus.ONGOING:
        return 'blue';
      case JourneyStatus.COMPLETED:
        return 'gray';
      case JourneyStatus.CANCELLED:
        return 'red';
      default:
        return 'default';
    }
  };

  const handleJourneyClick = (journey: Journey) => {
    if (onJourneyClick) {
      onJourneyClick(journey);
    } else {
      navigate(`/journeys/${journey.id}`);
    }
  };

  const renderJourneyItem = (journey: Journey) => (
    <List.Item>
      <Card
        hoverable
        onClick={() => handleJourneyClick(journey)}
        style={{ width: '100%' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={18}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space>
                <Badge status={getStatusColor(journey.status) as any} text={t(`journey.status.${journey.status}`) as string} />
                <Tag color="blue">{`${journey.availableWeightKg} kg`}</Tag>
              </Space>
              
              <Space>
                <EnvironmentOutlined />
                <Text strong>{journey.departureCity}, {journey.departureCountry}</Text>
                <ArrowRightOutlined />
                <Text strong>{journey.destinationCity}, {journey.destinationCountry}</Text>
              </Space>
              
              <Space>
                <CalendarOutlined />
                <Text>{dayjs(journey.departureDate).format('YYYY-MM-DD')}</Text>
                <ArrowRightOutlined />
                <Text>{dayjs(journey.arrivalDate).format('YYYY-MM-DD')}</Text>
              </Space>
              
              {journey.preferredItemTypes && journey.preferredItemTypes.length > 0 && (
                <Space wrap>
                  <ShoppingOutlined />
                  {journey.preferredItemTypes.map(type => (
                    <Tag key={type}>{t(`itemTypes.${type}`) as string}</Tag>
                  ))}
                </Space>
              )}
              
              {journey.notes && (
                <Text type="secondary" ellipsis>
                  {journey.notes}
                </Text>
              )}
            </Space>
          </Col>
          
          <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
            {journey.user && (
              <Space direction="vertical" align="end">
                <Avatar src={journey.user.profileImageUrl} icon={<UserOutlined />} />
                <Text>{journey.user.username}</Text>
                <Text type="secondary">{t('user.creditScore') as string}: {journey.user.creditScore}</Text>
              </Space>
            )}
          </Col>
        </Row>
      </Card>
    </List.Item>
  );

  return (
    <div>
      <Spin spinning={loading}>
        <List
          dataSource={journeys}
          renderItem={renderJourneyItem}
          pagination={
            total > pageSize
              ? {
                  total,
                  pageSize,
                  current,
                  onChange: onPageChange,
                  showSizeChanger: false,
                }
              : false
          }
          locale={{
            emptyText: (
              <Empty
                description={emptyText || t('journey.noJourneys') as string}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Spin>
    </div>
  );
};

export default JourneyList; 