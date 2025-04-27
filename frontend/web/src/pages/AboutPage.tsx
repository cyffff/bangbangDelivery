import React from 'react';
import { Typography, Card, Row, Col, Space, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Typography>
        <Title level={2}>{t('about.title') || 'About BangBang Delivery'}</Title>
        <Paragraph>
          BangBang Delivery is a global peer-to-peer delivery platform connecting travelers with people 
          who need items delivered internationally.
        </Paragraph>

        <Divider />

        <Title level={3}>{t('about.howItWorks') || 'How It Works'}</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card title={t('about.forShippers') || 'For Shippers'} bordered={false}>
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>1.</Text> Post your delivery needs
                </Paragraph>
                <Paragraph>
                  <Text strong>2.</Text> Connect with travelers going your route
                </Paragraph>
                <Paragraph>
                  <Text strong>3.</Text> Pay securely and track your delivery
                </Paragraph>
                <Paragraph>
                  <Text strong>4.</Text> Receive your items and leave a review
                </Paragraph>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card title={t('about.forTravelers') || 'For Travelers'} bordered={false}>
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>1.</Text> Post your upcoming travel plans
                </Paragraph>
                <Paragraph>
                  <Text strong>2.</Text> Accept delivery requests that match your route
                </Paragraph>
                <Paragraph>
                  <Text strong>3.</Text> Pick up and deliver the items
                </Paragraph>
                <Paragraph>
                  <Text strong>4.</Text> Get paid for your extra luggage space
                </Paragraph>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card title={t('about.security') || 'Security & Trust'} bordered={false}>
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>•</Text> Secure payment protection
                </Paragraph>
                <Paragraph>
                  <Text strong>•</Text> Verified user profiles
                </Paragraph>
                <Paragraph>
                  <Text strong>•</Text> Rating and review system
                </Paragraph>
                <Paragraph>
                  <Text strong>•</Text> 24/7 customer support
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Title level={3}>{t('about.ourMission') || 'Our Mission'}</Title>
        <Paragraph>
          We are on a mission to make global delivery more accessible, affordable, and 
          sustainable by utilizing existing travel routes and creating a trusted community 
          of users around the world.
        </Paragraph>

        <Title level={3}>{t('about.contactUs') || 'Contact Us'}</Title>
        <Paragraph>
          Email: support@bangbangdelivery.com<br />
          Phone: +1 (888) 888-8888
        </Paragraph>
      </Typography>
    </Card>
  );
};

export default AboutPage; 