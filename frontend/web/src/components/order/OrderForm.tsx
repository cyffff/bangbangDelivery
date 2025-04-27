import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, DatePicker, message, Select, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { OrderRequest } from '../../types/Order';
import { formatDateTimeForInput } from '../../utils/dateUtils';
import { demandApi } from '../../api/demandApi';
import { journeyApi } from '../../api/journeyApi';

interface OrderFormProps {
  initialValues?: OrderRequest;
  onSubmit: (values: OrderRequest) => Promise<void>;
  title: string;
  submitButtonText: string;
  isEditing?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  initialValues,
  onSubmit,
  title,
  submitButtonText,
  isEditing = false
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we have initialValues (editing mode), use those
    if (initialValues) {
      // Format dates for the form
      const formattedValues = {
        ...initialValues,
        expectedPickupDate: initialValues.expectedPickupDate 
          ? moment(initialValues.expectedPickupDate) 
          : undefined,
        expectedDeliveryDate: initialValues.expectedDeliveryDate 
          ? moment(initialValues.expectedDeliveryDate) 
          : undefined,
      };
      form.setFieldsValue(formattedValues);
    } 
    // If creating and we have state from location, use it to prefill
    else if (location.state) {
      // Pre-fill form with location state values
      form.setFieldsValue({
        demandId: location.state.demandId,
        journeyId: location.state.journeyId,
        demanderId: location.state.demanderId,
        travelerId: location.state.travelerId
      });
      
      // If demandId is provided, fetch demand details to pre-fill relevant fields
      if (location.state.demandId) {
        fetchDemandDetails(location.state.demandId);
      }
      
      // If journeyId is provided, fetch journey details to pre-fill relevant fields
      if (location.state.journeyId) {
        fetchJourneyDetails(location.state.journeyId);
      }
    }
  }, [initialValues, form, location.state]);

  const fetchDemandDetails = async (demandId: number) => {
    try {
      const demand = await demandApi.getDemandById(demandId);
      
      // Pre-fill form fields based on demand data
      form.setFieldsValue({
        itemName: demand.itemName || form.getFieldValue('itemName'),
        description: demand.description || form.getFieldValue('description'),
        pickupLocation: demand.originAddress || form.getFieldValue('pickupLocation'),
        deliveryLocation: demand.destinationAddress || form.getFieldValue('deliveryLocation'),
        weight: demand.weightKg || form.getFieldValue('weight'),
        volume: demand.volumeM3 || form.getFieldValue('volume'),
        price: demand.rewardAmount || form.getFieldValue('price')
      });
    } catch (error) {
      console.error('Failed to fetch demand details:', error);
    }
  };

  const fetchJourneyDetails = async (journeyId: number) => {
    try {
      const journey = await journeyApi.getJourneyById(journeyId.toString());
      
      // Pre-fill form fields based on journey data
      form.setFieldsValue({
        pickupLocation: journey.fromAddress || form.getFieldValue('pickupLocation'),
        deliveryLocation: journey.toAddress || form.getFieldValue('deliveryLocation'),
        expectedPickupDate: journey.departureDate ? moment(journey.departureDate) : form.getFieldValue('expectedPickupDate'),
        expectedDeliveryDate: journey.arrivalDate ? moment(journey.arrivalDate) : form.getFieldValue('expectedDeliveryDate')
      });
    } catch (error) {
      console.error('Failed to fetch journey details:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Convert moment dates to ISO strings
      const formattedValues: OrderRequest = {
        ...values,
        expectedPickupDate: values.expectedPickupDate ? values.expectedPickupDate.toISOString() : undefined,
        expectedDeliveryDate: values.expectedDeliveryDate ? values.expectedDeliveryDate.toISOString() : undefined,
      };

      await onSubmit(formattedValues);
      message.success(`Order ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/orders');
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} order:`, error);
      message.error(`Failed to ${isEditing ? 'update' : 'create'} order. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={title} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Form.Item
          name="demandId"
          label="Demand ID"
          rules={[{ required: true, message: 'Please enter the demand ID' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item
          name="journeyId"
          label="Journey ID"
          rules={[{ required: true, message: 'Please enter the journey ID' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item
          name="demanderId"
          label="Demander ID"
          rules={[{ required: true, message: 'Please enter the demander ID' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item
          name="travelerId"
          label="Traveler ID"
          rules={[{ required: true, message: 'Please enter the traveler ID' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item
          name="itemName"
          label="Item Name"
          rules={[{ required: true, message: 'Please enter the item name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="pickupLocation"
          label="Pickup Location"
          rules={[{ required: true, message: 'Please enter the pickup location' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="deliveryLocation"
          label="Delivery Location"
          rules={[{ required: true, message: 'Please enter the delivery location' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="expectedPickupDate"
          label="Expected Pickup Date"
          rules={[{ required: true, message: 'Please select the expected pickup date' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="expectedDeliveryDate"
          label="Expected Delivery Date"
          rules={[{ required: true, message: 'Please select the expected delivery date' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="weight"
          label="Weight (kg)"
          rules={[{ required: true, message: 'Please enter the weight' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0.01} step={0.1} />
        </Form.Item>

        <Form.Item
          name="volume"
          label="Volume (m³)"
          rules={[{ required: true, message: 'Please enter the volume' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0.01} step={0.1} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price ($)"
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0.01}
            step={0.01}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 16 }}>
            {submitButtonText}
          </Button>
          <Button onClick={() => navigate('/orders')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderForm; 