import React from 'react';
import { Typography, Card, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const TermsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Typography>
        <Title level={2}>{t('terms.title') || 'Terms of Service'}</Title>
        <Paragraph>
          <Text strong>Last updated:</Text> January 1, 2023
        </Paragraph>

        <Divider />

        <Title level={3}>1. {t('terms.acceptance') || 'Acceptance of Terms'}</Title>
        <Paragraph>
          By accessing or using BangBang Delivery platform ("the Service"), you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use the Service.
        </Paragraph>

        <Title level={3}>2. {t('terms.eligibility') || 'Eligibility'}</Title>
        <Paragraph>
          You must be at least 18 years of age to use this Service. By using the Service, you represent and warrant that you have 
          the right, authority, and capacity to enter into this agreement and abide by all the terms and conditions.
        </Paragraph>

        <Title level={3}>3. {t('terms.accountResponsibility') || 'Account Responsibility'}</Title>
        <Paragraph>
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility 
          for all activities that occur under your account.
        </Paragraph>

        <Title level={3}>4. {t('terms.userConduct') || 'User Conduct'}</Title>
        <Paragraph>
          You agree not to use the Service for any illegal purposes or in violation of any local, state, national, or international law. 
          You agree not to transport prohibited or dangerous items.
        </Paragraph>

        <Title level={3}>5. {t('terms.payments') || 'Payments and Fees'}</Title>
        <Paragraph>
          Our platform charges a service fee for connecting travelers with shippers. All payments are processed through our secure 
          payment system. Fees are non-refundable except in specific circumstances outlined in our refund policy.
        </Paragraph>

        <Title level={3}>6. {t('terms.liability') || 'Limitation of Liability'}</Title>
        <Paragraph>
          The Service is provided on an "as is" and "as available" basis. We do not guarantee that the Service will be uninterrupted, 
          timely, secure, or error-free. We are not responsible for the actions, content, information, or data of third parties.
        </Paragraph>

        <Title level={3}>7. {t('terms.termination') || 'Termination'}</Title>
        <Paragraph>
          We reserve the right to terminate or suspend your account and access to the Service without prior notice for any reason, 
          including a breach of these Terms.
        </Paragraph>

        <Title level={3}>8. {t('terms.changes') || 'Changes to Terms'}</Title>
        <Paragraph>
          We reserve the right to modify these terms at any time. We will provide notice of significant changes. Your continued use of 
          the Service after such modifications constitutes your acceptance of the revised terms.
        </Paragraph>

        <Title level={3}>9. {t('terms.contact') || 'Contact Information'}</Title>
        <Paragraph>
          If you have any questions about these Terms, please contact us at:<br />
          legal@bangbangdelivery.com
        </Paragraph>
      </Typography>
    </Card>
  );
};

export default TermsPage; 