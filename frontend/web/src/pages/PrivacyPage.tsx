import React from 'react';
import { Typography, Card, Divider } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <Typography>
        <Title level={2}>{t('privacy.title') || 'Privacy Policy'}</Title>
        <Paragraph>
          <Text strong>Last updated:</Text> January 1, 2023
        </Paragraph>

        <Divider />

        <Paragraph>
          This Privacy Policy describes how BangBang Delivery ("we", "us", or "our") collects, uses, and shares your 
          personal information when you use our platform.
        </Paragraph>

        <Title level={3}>1. {t('privacy.informationCollection') || 'Information We Collect'}</Title>
        <Paragraph>
          We collect information when you create an account, use our services, and communicate with us. This includes:
        </Paragraph>
        <ul>
          <li>Personal identifiers (name, email address, phone number)</li>
          <li>Identity verification information</li>
          <li>Payment information</li>
          <li>Device and browser information</li>
          <li>Location data</li>
          <li>Usage data and communications</li>
        </ul>

        <Title level={3}>2. {t('privacy.informationUse') || 'How We Use Your Information'}</Title>
        <Paragraph>
          We use your information to:
        </Paragraph>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Verify your identity and prevent fraud</li>
          <li>Communicate with you about our services</li>
          <li>Monitor and analyze trends, usage, and activities</li>
          <li>Comply with legal obligations</li>
        </ul>

        <Title level={3}>3. {t('privacy.informationSharing') || 'Information Sharing'}</Title>
        <Paragraph>
          We may share your information with:
        </Paragraph>
        <ul>
          <li>Other users as necessary to facilitate your transactions</li>
          <li>Service providers who perform services on our behalf</li>
          <li>Law enforcement or other third parties when required by law</li>
          <li>Business partners with your consent</li>
        </ul>

        <Title level={3}>4. {t('privacy.dataRetention') || 'Data Retention'}</Title>
        <Paragraph>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
          unless a longer retention period is required or permitted by law.
        </Paragraph>

        <Title level={3}>5. {t('privacy.dataTransfers') || 'International Data Transfers'}</Title>
        <Paragraph>
          Your information may be transferred to and processed in countries other than the one in which you reside. We 
          implement appropriate safeguards for cross-border transfers.
        </Paragraph>

        <Title level={3}>6. {t('privacy.security') || 'Security'}</Title>
        <Paragraph>
          We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. 
          However, no security system is impenetrable, and we cannot guarantee the security of our systems.
        </Paragraph>

        <Title level={3}>7. {t('privacy.rights') || 'Your Rights'}</Title>
        <Paragraph>
          Depending on your location, you may have certain rights regarding your personal information, including the right to:
        </Paragraph>
        <ul>
          <li>Access or obtain a copy of your information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your information</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
        </ul>

        <Title level={3}>8. {t('privacy.changes') || 'Changes to This Policy'}</Title>
        <Paragraph>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy 
          on this page and updating the "Last updated" date.
        </Paragraph>

        <Title level={3}>9. {t('privacy.contact') || 'Contact Us'}</Title>
        <Paragraph>
          If you have any questions about this Privacy Policy, please contact us at:<br />
          privacy@bangbangdelivery.com
        </Paragraph>
      </Typography>
    </Card>
  );
};

export default PrivacyPage; 