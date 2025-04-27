import React from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Steps, 
  Divider, 
  Button, 
  Space,
  List
} from 'antd';
import { 
  SearchOutlined, 
  CheckCircleOutlined, 
  DollarOutlined, 
  StarOutlined,
  GlobalOutlined,
  ShoppingOutlined,
  TeamOutlined,
  SafetyOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const FAQs = [
  {
    question: 'How does BangBang Delivery ensure my items are safe?',
    answer: 'We verify all users through our KYC process, provide insurance options for high-value items, and have a comprehensive rating system. Our platform also enables secure communication between senders and travelers.'
  },
  {
    question: 'What types of items can I send?',
    answer: 'You can send non-prohibited items that comply with customs regulations. Common items include electronics, clothing, documents, and gifts. Prohibited items include perishables, dangerous goods, and items that violate import/export laws.'
  },
  {
    question: 'How much can I earn as a traveler?',
    answer: 'Earnings vary based on the items you deliver, the route, and the urgency. Travelers typically earn between $50-$300 per delivery, depending on the size, weight, and distance.'
  },
  {
    question: 'What happens if an item is lost or damaged?',
    answer: 'If you\'ve purchased insurance, you\'ll be covered according to your insurance policy. Otherwise, we have a dispute resolution process to help mediate between senders and travelers.'
  },
  {
    question: 'How are payments handled?',
    answer: 'Payments are securely processed through our platform. Funds are held in escrow until the delivery is confirmed, ensuring protection for both parties.'
  }
];

const HowItWorksPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: 40 }}>
        How BangBang Delivery Works
      </Title>

      <Row gutter={[24, 48]}>
        <Col span={24}>
          <Card>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={12}>
                <Title level={2}>Global Peer-to-Peer Delivery Platform</Title>
                <Paragraph style={{ fontSize: 16 }}>
                  BangBang Delivery connects people who need to send items internationally with travelers who have extra space in their luggage. Save up to 80% compared to traditional shipping services while helping travelers earn extra money on their journeys.
                </Paragraph>
                <Space>
                  <Button type="primary" size="large">
                    <Link to="/create-task">Send Something</Link>
                  </Button>
                  <Button size="large">
                    <Link to="/journeys">Become a Traveler</Link>
                  </Button>
                </Space>
              </Col>
              <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                <img 
                  src="https://placehold.co/600x400/e6f7ff/1890ff?text=Delivery+Platform+Illustration" 
                  alt="BangBang Delivery Illustration" 
                  style={{ maxWidth: '100%', borderRadius: 8 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
            For Item Senders
          </Title>
          <Steps
            direction="vertical"
            current={4}
            items={[
              {
                title: 'Post Your Delivery Request',
                description: 'Describe what you need delivered, where it\'s going, and how much you\'re willing to pay.',
                icon: <ShoppingOutlined />
              },
              {
                title: 'Get Offers from Travelers',
                description: 'Travelers heading to your destination will make offers to deliver your item.',
                icon: <TeamOutlined />
              },
              {
                title: 'Choose Your Traveler',
                description: 'Review ratings, prices, and delivery timelines to select the best traveler for your needs.',
                icon: <CheckCircleOutlined />
              },
              {
                title: 'Meet and Handover',
                description: 'Meet the traveler in person or arrange for pickup to hand over your item.',
                icon: <SafetyOutlined />
              },
              {
                title: 'Track and Receive',
                description: 'Track delivery progress and receive your item at the destination.',
                icon: <GlobalOutlined />
              }
            ]}
          />
        </Col>

        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
            For Travelers
          </Title>
          <Steps
            direction="vertical"
            current={4}
            items={[
              {
                title: 'Post Your Journey',
                description: 'Share your travel route, dates, and how much space you have available.',
                icon: <GlobalOutlined />
              },
              {
                title: 'Browse Delivery Requests',
                description: 'Find delivery requests matching your route and make offers.',
                icon: <SearchOutlined />
              },
              {
                title: 'Get Matched with Senders',
                description: 'Once a sender accepts your offer, you\'ll be connected to coordinate the details.',
                icon: <CheckCircleOutlined />
              },
              {
                title: 'Collect the Item',
                description: 'Meet the sender to collect the item before your journey.',
                icon: <ShoppingOutlined />
              },
              {
                title: 'Deliver and Earn',
                description: 'Deliver the item at the destination and get paid for your service.',
                icon: <DollarOutlined />
              }
            ]}
          />
        </Col>

        <Col span={24}>
          <Card style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={12}>
                <Title level={3}>How We Ensure Trust & Safety</Title>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    'Verified User Profiles with KYC',
                    'Secure In-App Messaging',
                    'Escrow Payment System',
                    'Comprehensive Review System',
                    'Optional Insurance Coverage',
                    'Dispute Resolution Process'
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />}
                        title={item}
                      />
                    </List.Item>
                  )}
                />
              </Col>
              <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                <SafetyOutlined style={{ fontSize: 120, color: '#52c41a' }} />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
            <QuestionCircleOutlined style={{ marginRight: 8 }} />
            Frequently Asked Questions
          </Title>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={FAQs}
            renderItem={(item) => (
              <List.Item>
                <Card hoverable>
                  <Title level={4}>{item.question}</Title>
                  <Paragraph>{item.answer}</Paragraph>
                </Card>
              </List.Item>
            )}
          />
        </Col>

        <Col span={24} style={{ textAlign: 'center' }}>
          <Divider />
          <Title level={3}>Ready to Get Started?</Title>
          <Paragraph style={{ fontSize: 16, maxWidth: 600, margin: '0 auto 24px' }}>
            Join thousands of users who are already saving money and making extra income with BangBang Delivery.
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" icon={<ShoppingOutlined />}>
              <Link to="/create-task">Post a Delivery Request</Link>
            </Button>
            <Button size="large" icon={<GlobalOutlined />}>
              <Link to="/create-journey">Add Your Journey</Link>
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default HowItWorksPage; 