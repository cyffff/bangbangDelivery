import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select, Card, Row, Col, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Journey, JourneyCreateRequest, JourneyUpdateRequest } from '../../types/Journey';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

interface JourneyFormProps {
  initialValues?: Journey;
  onSubmit: (values: JourneyCreateRequest | JourneyUpdateRequest) => Promise<void>;
  submitButtonText?: string;
  loading?: boolean;
}

const JourneyForm: React.FC<JourneyFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText = 'Submit',
  loading = false
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Set initial values when component mounts or initialValues changes
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateRange: [
          dayjs(initialValues.departureDate),
          dayjs(initialValues.arrivalDate)
        ],
        preferredItemTypes: initialValues.preferredItemTypes || []
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      
      // Extract dates from range picker
      const [departureDate, arrivalDate] = values.dateRange;
      
      // Prepare data for submission
      const journeyData = {
        departureCountry: values.departureCountry,
        departureCity: values.departureCity,
        destinationCountry: values.destinationCountry,
        destinationCity: values.destinationCity,
        departureDate: departureDate.format('YYYY-MM-DD'),
        arrivalDate: arrivalDate.format('YYYY-MM-DD'),
        availableWeightKg: values.availableWeightKg,
        preferredItemTypes: values.preferredItemTypes,
        notes: values.notes
      };
      
      await onSubmit(journeyData);
      
      if (!initialValues) {
        // Reset form after successful submission for create mode
        form.resetFields();
      }
      
      message.success(initialValues ? t('journey.updateSuccess') as string : t('journey.createSuccess') as string);
    } catch (error) {
      console.error('Failed to submit journey:', error);
      message.error(t('journey.submitError') as string);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <Title level={3}>{initialValues ? t('journey.editTitle') as string : t('journey.createTitle') as string}</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          preferredItemTypes: [],
          availableWeightKg: 5
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="departureCountry"
              label={t('journey.departureCountry') as string}
              rules={[{ required: true, message: t('form.required') as string }]}
            >
              <Input placeholder={t('journey.countryPlaceholder') as string} />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="departureCity"
              label={t('journey.departureCity') as string}
              rules={[{ required: true, message: t('form.required') as string }]}
            >
              <Input placeholder={t('journey.cityPlaceholder') as string} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="destinationCountry"
              label={t('journey.destinationCountry') as string}
              rules={[{ required: true, message: t('form.required') as string }]}
            >
              <Input placeholder={t('journey.countryPlaceholder') as string} />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="destinationCity"
              label={t('journey.destinationCity') as string}
              rules={[{ required: true, message: t('form.required') as string }]}
            >
              <Input placeholder={t('journey.cityPlaceholder') as string} />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="dateRange"
          label={t('journey.travelDates') as string}
          rules={[{ required: true, message: t('form.required') as string }]}
        >
          <RangePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD"
          />
        </Form.Item>
        
        <Form.Item
          name="availableWeightKg"
          label={t('journey.availableWeight') as string}
          rules={[{ required: true, message: t('form.required') as string }]}
        >
          <InputNumber
            min={0.1}
            max={30}
            step={0.1}
            style={{ width: '100%' }}
            addonAfter="kg"
          />
        </Form.Item>
        
        <Form.Item
          name="preferredItemTypes"
          label={t('journey.preferredItemTypes') as string}
          rules={[{ required: true, message: t('form.required') as string }]}
        >
          <Select
            mode="multiple"
            placeholder={t('journey.selectItemTypes') as string}
            style={{ width: '100%' }}
          >
            {ITEM_TYPES.map(type => (
              <Option key={type} value={type}>
                {t(`itemTypes.${type}`) as string}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="notes"
          label={t('journey.notes') as string}
        >
          <TextArea
            rows={4}
            placeholder={t('journey.notesPlaceholder') as string}
          />
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting || loading}
            block
          >
            {submitButtonText}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default JourneyForm; 