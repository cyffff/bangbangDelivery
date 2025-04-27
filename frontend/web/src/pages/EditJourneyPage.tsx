import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getJourneyById, updateJourney } from '../api/journeyApi';
import { Journey, JourneyUpdateRequest } from '../types/Journey';
import JourneyForm from '../components/journey/JourneyForm';

const { Title } = Typography;

const EditJourneyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJourney(id);
    }
  }, [id]);

  const fetchJourney = async (journeyId: string) => {
    try {
      setLoading(true);
      const data = await getJourneyById(journeyId);
      setJourney(data);
    } catch (error) {
      console.error('Failed to fetch journey:', error);
      message.error(t('journey.fetchError') as string);
      navigate('/journeys');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: JourneyUpdateRequest) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      const updatedJourney = await updateJourney(id, values);
      message.success(t('journey.updateSuccess') as string);
      navigate(`/journeys/${updatedJourney.id}`);
    } catch (error) {
      console.error('Failed to update journey:', error);
      message.error(t('journey.updateError') as string);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!journey) {
    return (
      <Card>
        <Typography.Text>{t('journey.notFound') as string}</Typography.Text>
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Title level={2}>{t('journey.editTitle') as string}</Title>
        <Card>
          <JourneyForm 
            initialValues={journey}
            onSubmit={handleSubmit}
            submitButtonText={t('common.update') as string}
            loading={submitting}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default EditJourneyPage; 