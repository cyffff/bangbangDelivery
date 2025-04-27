import React, { useState } from 'react';
import { Typography, Card, List, Button, Tag, Space, Badge, Tabs, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  InfoCircleOutlined, 
  StarOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data - in a real implementation, this would come from an API
const mockNotifications = [
  {
    id: '1',
    type: 'system',
    title: 'Welcome to BangBang Delivery',
    content: 'Thank you for joining our platform. Start by creating your first delivery request or registering as a traveler.',
    isRead: true,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: '2',
    type: 'order',
    title: 'New Order Match',
    content: 'Your delivery request "Electronics from Dubai to Shanghai" has been matched with a traveler.',
    isRead: false,
    createdAt: dayjs().subtract(2, 'hour').toISOString(),
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    content: 'Your payment of $120 for order #ORD-2023-12345 has been confirmed.',
    isRead: false,
    createdAt: dayjs().subtract(5, 'hour').toISOString(),
  },
  {
    id: '4',
    type: 'journey',
    title: 'Journey Update',
    content: 'A traveler has updated their arrival time for your matched journey.',
    isRead: false,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: '5',
    type: 'review',
    title: 'New Review',
    content: 'You have received a 5-star review from your last delivery.',
    isRead: true,
    createdAt: dayjs().subtract(3, 'day').toISOString(),
  },
];

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'order':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'payment':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'journey':
        return <InfoCircleOutlined style={{ color: '#722ed1' }} />;
      case 'review':
        return <StarOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <BellOutlined />;
    }
  };

  const getNotificationTypeTag = (type: string) => {
    let color = '';
    let text = '';
    
    switch (type) {
      case 'system':
        color = 'blue';
        text = t('notification.type.system') || 'System';
        break;
      case 'order':
        color = 'orange';
        text = t('notification.type.order') || 'Order';
        break;
      case 'payment':
        color = 'green';
        text = t('notification.type.payment') || 'Payment';
        break;
      case 'journey':
        color = 'purple';
        text = t('notification.type.journey') || 'Journey';
        break;
      case 'review':
        color = 'gold';
        text = t('notification.type.review') || 'Review';
        break;
      default:
        color = 'default';
        text = type;
    }

    return <Tag color={color}>{text}</Tag>;
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const filterNotifications = (tab: string) => {
    if (tab === 'all') {
      return notifications;
    } else if (tab === 'unread') {
      return notifications.filter(notification => !notification.isRead);
    } else {
      return notifications.filter(notification => notification.type === tab);
    }
  };

  const filteredNotifications = filterNotifications(activeTab);
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <Card>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} align="center">
        <Title level={2} style={{ margin: 0 }}>
          {t('notification.title') || 'Notifications'} 
          {unreadCount > 0 && <Badge count={unreadCount} style={{ marginLeft: 8 }} />}
        </Title>
        
        <Button 
          type="primary" 
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          {t('notification.markAllAsRead') || 'Mark All as Read'}
        </Button>
      </Space>
      
      <Tabs defaultActiveKey="all" onChange={setActiveTab}>
        <TabPane tab={t('notification.tabs.all') || 'All'} key="all" />
        <TabPane 
          tab={
            <>
              {t('notification.tabs.unread') || 'Unread'} 
              {unreadCount > 0 && <Badge count={unreadCount} style={{ marginLeft: 8 }} />}
            </>
          } 
          key="unread" 
        />
        <TabPane tab={t('notification.tabs.system') || 'System'} key="system" />
        <TabPane tab={t('notification.tabs.order') || 'Order'} key="order" />
        <TabPane tab={t('notification.tabs.payment') || 'Payment'} key="payment" />
        <TabPane tab={t('notification.tabs.journey') || 'Journey'} key="journey" />
        <TabPane tab={t('notification.tabs.review') || 'Review'} key="review" />
      </Tabs>
      
      {filteredNotifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('notification.empty') || 'No notifications'}
        />
      ) : (
        <List
          dataSource={filteredNotifications}
          renderItem={notification => (
            <List.Item
              key={notification.id}
              style={{ 
                background: notification.isRead ? 'transparent' : 'rgba(24, 144, 255, 0.05)',
                borderLeft: notification.isRead ? 'none' : '3px solid #1890ff',
                paddingLeft: notification.isRead ? 24 : 21
              }}
              actions={[
                !notification.isRead && (
                  <Button 
                    type="link" 
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    {t('notification.markAsRead') || 'Mark as Read'}
                  </Button>
                )
              ]}
            >
              <List.Item.Meta
                avatar={getNotificationTypeIcon(notification.type)}
                title={
                  <Space>
                    <Text strong>{notification.title}</Text>
                    {getNotificationTypeTag(notification.type)}
                    {!notification.isRead && (
                      <Badge status="processing" color="#1890ff" />
                    )}
                  </Space>
                }
                description={
                  <>
                    <Text>{notification.content}</Text>
                    <br />
                    <Text type="secondary">{dayjs(notification.createdAt).fromNow()}</Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default NotificationsPage; 