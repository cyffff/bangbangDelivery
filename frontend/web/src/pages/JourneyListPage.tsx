import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  InputNumber, 
  Space, 
  message 
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { searchJourneys } from '../api/journeyApi';
import { Journey, JourneySearchParams } from '../types/Journey';
import JourneyList from '../components/journey/JourneyList';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Item types that can be carried in a journey
const ITEM_TYPES = [
  'electronics',
  'clothing',
  'documents',
  'cosmetics',
  'medicine',
  'food',
  'toys',
  'books',
  'accessories',
  'other'
];

const JourneyListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<JourneySearchParams>({
    page: 0,
    size: pageSize
  });

  // Fetch journeys when search parameters change
  useEffect(() => {
    fetchJourneys();
  }, [searchParams]);

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      const response = await searchJourneys(searchParams);
      setJourneys(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch journeys:', error);
      message.error(t('journey.fetchError') as string);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: any) => {
    const params: JourneySearchParams = {
      page: 0,
      size: pageSize
    };

    if (values.departureCountry) {
      params.departureCountry = values.departureCountry;
    }

    if (values.departureCity) {
      params.departureCity = values.departureCity;
    }

    if (values.destinationCountry) {
      params.destinationCountry = values.destinationCountry;
    }

    if (values.destinationCity) {
      params.destinationCity = values.destinationCity;
    }

    if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
      params.departureDate = values.dateRange[0].format('YYYY-MM-DD');
      params.arrivalDate = values.dateRange[1].format('YYYY-MM-DD');
    }

    if (values.minWeight) {
      params.minAvailableWeightKg = values.minWeight;
    }

    if (values.maxWeight) {
      params.maxAvailableWeightKg = values.maxWeight;
    }

    if (values.itemTypes && values.itemTypes.length > 0) {
      params.preferredItemTypes = values.itemTypes;
    }

    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchParams({
      page: 0,
      size: pageSize
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setSearchParams({
      ...searchParams,
      page: page - 1,
      size: pageSize
    });
  };

  const handleCreateJourney = () => {
    navigate('/journeys/create');
  };

  return (
    <div>
      <Row gutter={[16, 24]} justify="space-between" align="middle">
        <Col>
          <Title level={2}>{t('journey.pageTitle') as string}</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateJourney}
          >
            {t('journey.createNew') as string}
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="departureCountry" label={t('journey.departureCountry') as string}>
                <Input placeholder={t('journey.searchCountry') as string} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="departureCity" label={t('journey.departureCity') as string}>
                <Input placeholder={t('journey.searchCity') as string} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="destinationCountry" label={t('journey.destinationCountry') as string}>
                <Input placeholder={t('journey.searchCountry') as string} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="destinationCity" label={t('journey.destinationCity') as string}>
                <Input placeholder={t('journey.searchCity') as string} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="dateRange" label={t('journey.travelDates') as string}>
                <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={t('journey.weightRange') as string}>
                <Input.Group compact>
                  <Form.Item name="minWeight" noStyle>
                    <InputNumber
                      min={0}
                      placeholder={t('journey.minWeight') as string}
                      style={{ width: '50%' }}
                      addonAfter="kg"
                    />
                  </Form.Item>
                  <Form.Item name="maxWeight" noStyle>
                    <InputNumber
                      min={0}
                      placeholder={t('journey.maxWeight') as string}
                      style={{ width: '50%' }}
                      addonAfter="kg"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="itemTypes" label={t('journey.preferredItemTypes') as string}>
                <Select
                  mode="multiple"
                  placeholder={t('journey.selectItemTypes') as string}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {ITEM_TYPES.map(type => (
                    <Option key={type} value={type}>
                      {t(`itemTypes.${type}`) as string}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Space>
                <Button onClick={handleReset}>
                  {t('common.reset') as string}
                </Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  {t('common.search') as string}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <JourneyList
        journeys={journeys}
        loading={loading}
        total={totalElements}
        current={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JourneyListPage; 