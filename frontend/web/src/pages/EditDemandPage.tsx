import React, { useEffect, useState } from 'react';
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
  Skeleton,
  message
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDemandById,
  updateDemand, 
  selectCurrentDemand, 
  selectDemandLoading, 
  selectDemandError, 
  clearError 
} from '../store/slices/demandSlice';
import { UpdateDemandRequest } from '../api/demandApi';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
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

const EditDemandPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const demand = useSelector(selectCurrentDemand);
  const loading = useSelector(selectDemandLoading);
  const error = useSelector(selectDemandError);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('Please login to edit a demand');
      navigate('/login', { state: { from: `/demands/edit/${id}` } });
    }
  }, [isAuthenticated, navigate, id]);

  // Load demand data
  useEffect(() => {
    if (id) {
      dispatch(fetchDemandById(id) as any);
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  // Set form values when demand data is loaded
  useEffect(() => {
    if (demand && !initialValuesLoaded) {
      // Check if user is the owner of the demand
      if (currentUser && demand.userId !== currentUser.id.toString()) {
        message.error('You are not authorized to edit this demand');
        navigate(`/demands/${id}`);
        return;
      }

      // Check if demand can be edited
      if (demand.status !== 'PENDING') {
        message.error('Only pending demands can be edited');
        navigate(`/demands/${id}`);
        return;
      }

      form.setFieldsValue({
        title: demand.title,
        description: demand.description,
        itemType: demand.itemType,
        weightKg: demand.weightKg,
        estimatedValue: demand.estimatedValue,
        originCountry: demand.originCountry,
        originCity: demand.originCity,
        destinationCountry: demand.destinationCountry,
        destinationCity: demand.destinationCity,
        deadline: dayjs(demand.deadline),
        rewardAmount: demand.rewardAmount
      });
      
      setInitialValuesLoaded(true);
    }
  }, [demand, form, initialValuesLoaded, currentUser, navigate, id]);

  // Handle form submission
  const onFinish = (values: any) => {
    if (!id) return;
    
    const updateRequest: UpdateDemandRequest = {
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

    dispatch(updateDemand({ id, demand: updateRequest }) as any)
      .unwrap()
      .then(() => {
        message.success('Demand updated successfully!');
        navigate(`/demands/${id}`);
      })
      .catch(() => {
        // Error will be handled by the reducer and displayed in the UI
      });
  };

  if (loading && !demand) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    );
  }

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
          {t('demand.edit.title')}
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>
          {t('demand.edit.subtitle')}
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
          name="editDemandForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
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

          <Row gutter={16}>
            <Col xs={12}>
              <Form.Item>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => navigate(`/demands/${id}`)}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  Update Demand
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default EditDemandPage; 