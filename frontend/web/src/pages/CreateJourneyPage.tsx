import React, { useState } from 'react';
import { Typography, Row, Col, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createJourney } from '../api/journeyApi';
import { JourneyCreateRequest } from '../types/Journey';
import JourneyForm from '../components/journey/JourneyForm';

const { Title } = Typography;

const CreateJourneyPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: JourneyCreateRequest) => {
    try {
      setLoading(true);
      const journey = await createJourney(values);
      message.success(t('journey.createSuccess') as string);
      navigate(`/journeys/${journey.id}`);
    } catch (error) {
      console.error('Failed to create journey:', error);
      message.error(t('journey.createError') as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Title level={2}>{t('journey.createNew') as string}</Title>
        <Card>
          <JourneyForm 
            onSubmit={handleSubmit}
            submitButtonText={t('journey.create') as string}
            loading={loading}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default CreateJourneyPage; 