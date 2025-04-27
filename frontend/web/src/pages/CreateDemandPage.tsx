import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  DatePicker, 
  InputNumber, 
  Select, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Alert,
  message
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createDemand, selectDemandLoading, selectDemandError, clearError } from '../store/slices/demandSlice';
import { CreateDemandRequest } from '../api/demandApi';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Item types for selection
const itemTypes = [
  { value: 'DOCUMENT', label: 'Documents' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'COSMETICS', label: 'Cosmetics' },
  { value: 'MEDICINE', label: 'Medicine' },
  { value: 'FOOD', label: 'Food items' },
  { value: 'GIFTS', label: 'Gifts' },
  { value: 'OTHER', label: 'Other' },
];

// Popular routes for selection
const popularRoutes = [
  { origin: { country: 'China', city: 'Shanghai' }, destination: { country: 'USA', city: 'New York' } },
  { origin: { country: 'China', city: 'Beijing' }, destination: { country: 'UK', city: 'London' } },
  { origin: { country: 'China', city: 'Guangzhou' }, destination: { country: 'UAE', city: 'Dubai' } },
  { origin: { country: 'China', city: 'Shenzhen' }, destination: { country: 'Australia', city: 'Sydney' } },
  { origin: { country: 'China', city: 'Hangzhou' }, destination: { country: 'France', city: 'Paris' } },
];

const CreateDemandPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectDemandLoading);
  const error = useSelector(selectDemandError);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [form] = Form.useForm();
  
  // State for selected route
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      message.warning('Please login to create a demand');
      navigate('/login', { state: { from: '/demands/create' } });
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle form submission
  const onFinish = (values: any) => {
    const demandRequest: CreateDemandRequest = {
      title: values.title,
      description: values.description,
      itemType: values.itemType,
      weightKg: values.weightKg,
      estimatedValue: values.estimatedValue,
      originCountry: values.originCountry,
      originCity: values.originCity,
      destinationCountry: values.destinationCountry,
      destinationCity: values.destinationCity,
      deadline: values.deadline.format('YYYY-MM-DD'),
      rewardAmount: values.rewardAmount
    };

    dispatch(createDemand(demandRequest) as any)
      .unwrap()
      .then(() => {
        message.success('Demand created successfully!');
        navigate('/demands');
      })
      .catch(() => {
        // Error will be handled by the reducer and displayed in the UI
      });
  };

  // Handle route selection
  const handleRouteSelect = (index: number) => {
    const route = popularRoutes[index];
    setSelectedRoute(index);
    
    form.setFieldsValue({
      originCountry: route.origin.country,
      originCity: route.origin.city,
      destinationCountry: route.destination.country,
      destinationCity: route.destination.city
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Title level={2} style={{ marginBottom: 8 }}>
          {t('demand.create.title')}
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>
          {t('demand.create.subtitle')}
        </Paragraph>

        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 24 }}
            closable
            onClose={() => dispatch(clearError())}
          />
        )}

        <Form
          form={form}
          name="createDemandForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{
            weightKg: 1.0,
            rewardAmount: 30
          }}
        >
          <Title level={4}>Item Information</Title>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: 'Please enter a title' },
                  { max: 100, message: 'Title cannot exceed 100 characters' }
                ]}
              >
                <Input placeholder="E.g., 'Deliver small electronics from Shanghai to Dubai'" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="itemType"
                label="Item Type"
                rules={[{ required: true, message: 'Please select item type' }]}
              >
                <Select placeholder="Select item type">
                  {itemTypes.map(type => (
                    <Option key={type.value} value={type.value}>{type.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="weightKg"
                label="Weight (kg)"
                rules={[
                  { required: true, message: 'Please enter weight' },
                  { type: 'number', min: 0.1, max: 30, message: 'Weight must be between 0.1kg and 30kg' }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter weight in kg" 
                  step={0.1} 
                  precision={1} 
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Describe your item in detail (size, condition, special requirements, etc.)" 
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="estimatedValue"
                label="Estimated Value (USD)"
                tooltip="Estimated value helps carriers understand the importance of your item"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter value in USD" 
                  min={0} 
                  precision={2} 
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="rewardAmount"
                label="Reward Amount (USD)"
                rules={[
                  { required: true, message: 'Please enter reward amount' },
                  { type: 'number', min: 5, message: 'Minimum reward is $5' }
                ]}
                tooltip="How much you're willing to pay the carrier for delivering your item"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter reward amount" 
                  min={5} 
                  precision={2} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Route Information</Title>
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            Popular routes (click to select):
          </Paragraph>
          
          <div style={{ marginBottom: 24 }}>
            <Row gutter={[8, 8]}>
              {popularRoutes.map((route, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Card 
                    size="small" 
                    hoverable 
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedRoute === index ? '#e6f7ff' : undefined,
                      borderColor: selectedRoute === index ? '#1890ff' : undefined
                    }}
                    onClick={() => handleRouteSelect(index)}
                  >
                    <div style={{ fontSize: '14px', textAlign: 'center' }}>
                      <div><strong>{route.origin.city}</strong> ({route.origin.country})</div>
                      <div style={{ margin: '4px 0' }}>↓</div>
                      <div><strong>{route.destination.city}</strong> ({route.destination.country})</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="originCountry"
                label="Origin Country"
                rules={[{ required: true, message: 'Please enter origin country' }]}
              >
                <Input placeholder="Country from where the item will be sent" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="originCity"
                label="Origin City"
                rules={[{ required: true, message: 'Please enter origin city' }]}
              >
                <Input placeholder="City from where the item will be sent" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="destinationCountry"
                label="Destination Country"
                rules={[{ required: true, message: 'Please enter destination country' }]}
              >
                <Input placeholder="Country where the item should be delivered" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="destinationCity"
                label="Destination City"
                rules={[{ required: true, message: 'Please enter destination city' }]}
              >
                <Input placeholder="City where the item should be delivered" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="deadline"
                label="Delivery Deadline"
                rules={[{ required: true, message: 'Please select a deadline' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => {
                    // Cannot select days before today
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Create Demand
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateDemandPage; 