import React from 'react';
import { Typography, Card, Collapse, Input, Button, Space, Divider, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const HelpPage: React.FC = () => {
  const { t } = useTranslation();

  const generalFaqs = [
    {
      question: 'What is BangBang Delivery?',
      answer: 'BangBang Delivery is a platform that connects people who need to send items internationally with travelers who have extra space in their luggage and are traveling to the same destination.'
    },
    {
      question: 'How does the service work?',
      answer: 'Shippers post delivery needs, and travelers post their journey details. Our system matches compatible requests, and users can communicate to arrange pickup and delivery details. Payments are held in escrow until successful delivery.'
    },
    {
      question: 'Is BangBang Delivery available worldwide?',
      answer: 'We currently operate in major cities across Asia, the Middle East, and North America, with plans to expand globally. Check our coverage map for specific locations.'
    }
  ];

  const shipperFaqs = [
    {
      question: 'How do I create a delivery request?',
      answer: 'Log in to your account, click "Create Demand" from your dashboard, and fill in details about your item, pickup location, delivery location, deadline, and any special instructions.'
    },
    {
      question: 'How much does it cost to ship an item?',
      answer: 'Shipping costs vary based on item size, weight, distance, and traveler compensation. You\'ll see the total cost before confirming your shipment.'
    },
    {
      question: 'How do I know my items are safe?',
      answer: 'All travelers undergo identity verification and maintain a trustworthiness rating. Additionally, your payment is held in escrow until successful delivery, and our insurance covers items up to $500 in value.'
    }
  ];

  const travelerFaqs = [
    {
      question: 'How do I offer my travel luggage space?',
      answer: 'Log in, click "Create Journey", and enter your travel details including departure/arrival locations, dates, and how much space you can offer.'
    },
    {
      question: 'How much can I earn?',
      answer: 'Earnings vary based on the route, items carried, and your terms. Most travelers earn between $20-200 per trip, depending on the items and destination.'
    },
    {
      question: 'What items am I not allowed to carry?',
      answer: 'Prohibited items include illegal goods, hazardous materials, perishables, valuables exceeding $500, and anything that would violate airline, customs, or immigration regulations.'
    }
  ];

  const paymentFaqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, PayPal, and various local payment options depending on your region.'
    },
    {
      question: 'When will travelers get paid?',
      answer: 'Travelers receive payment 3-5 business days after the delivery is confirmed by the recipient.'
    },
    {
      question: 'What if an item is damaged during delivery?',
      answer: 'Our platform includes basic insurance coverage. If an item is damaged, the recipient should document the damage when receiving the item and file a claim through our resolution center.'
    }
  ];

  const renderFaqSection = (title: string, faqs: { question: string; answer: string }[]) => (
    <>
      <Title level={3}>{title}</Title>
      <Collapse bordered={false}>
        {faqs.map((faq, index) => (
          <Panel header={faq.question} key={index}>
            <Paragraph>{faq.answer}</Paragraph>
          </Panel>
        ))}
      </Collapse>
      <Divider />
    </>
  );

  return (
    <Card>
      <Typography>
        <Title level={2}>{t('help.title') || 'Help Center'}</Title>
        
        <Row justify="center" style={{ margin: '20px 0' }}>
          <Col xs={24} sm={18} md={16} lg={12}>
            <Input.Search
              placeholder={t('help.searchPlaceholder') || "Search for help topics..."}
              enterButton={<Button type="primary" icon={<SearchOutlined />}>{t('common.search') || "Search"}</Button>}
              size="large"
            />
          </Col>
        </Row>

        <Divider />

        {renderFaqSection(t('help.generalFaqs') || 'General Questions', generalFaqs)}
        {renderFaqSection(t('help.shipperFaqs') || 'For Shippers', shipperFaqs)}
        {renderFaqSection(t('help.travelerFaqs') || 'For Travelers', travelerFaqs)}
        {renderFaqSection(t('help.paymentFaqs') || 'Payment & Insurance', paymentFaqs)}

        <Title level={3}>{t('help.stillNeedHelp') || 'Still Need Help?'}</Title>
        <Space>
          <Button type="primary">{t('help.contactSupport') || 'Contact Support'}</Button>
          <Button>{t('help.reportIssue') || 'Report an Issue'}</Button>
        </Space>
        
        <Paragraph style={{ marginTop: 20 }}>
          <Text strong>{t('help.supportHours') || 'Support Hours:'}</Text> Monday to Friday, 9:00 AM - 6:00 PM (GMT+8)
        </Paragraph>
        <Paragraph>
          <Text strong>{t('help.email') || 'Email:'}</Text> support@bangbangdelivery.com
        </Paragraph>
      </Typography>
    </Card>
  );
};

export default HelpPage; 