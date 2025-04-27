import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Steps, Select, InputNumber, Upload, Divider, Radio, message, Modal, Row, Col } from 'antd';
import { UploadOutlined, EnvironmentOutlined, InfoCircleOutlined, UserOutlined, PhoneOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const itemTypes = [
  { value: 'food', label: 'Food' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'documents', label: 'Documents' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'other', label: 'Other' }
];

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Delivery request created successfully!');
      navigate('/my-tasks');
    } catch (error) {
      message.error('Failed to create delivery request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        // Validate first step fields
        await form.validateFields(['itemType', 'itemName', 'weight', 'width', 'height', 'length']);
      } else if (currentStep === 1) {
        // Validate second step fields
        await form.validateFields([
          'requesterName', 'requesterPhone', 'recipientName', 
          'recipientPhone', 'destinationCity', 'destinationCountry'
        ]);
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const showConfirmModal = () => {
    const values = form.getFieldsValue();
    Modal.confirm({
      title: 'Confirm Delivery Request',
      content: (
        <div>
          <p>Please review your delivery request details:</p>
          <p><strong>Item:</strong> {values.itemName} ({values.itemType})</p>
          <p><strong>Weight:</strong> {values.weight} kg</p>
          <p><strong>Size:</strong> {values.length}×{values.width}×{values.height} cm</p>
          <p><strong>From:</strong> {values.requesterName}</p>
          <p><strong>To:</strong> {values.recipientName}, {values.destinationCity}, {values.destinationCountry}</p>
          <p><strong>Delivery Method:</strong> {values.deliveryMethod}</p>
        </div>
      ),
      onOk() {
        form.submit();
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Title level={4}>Item Information</Title>
            <Paragraph type="secondary">
              Tell us what you need to deliver. This information helps travelers decide if they can help.
            </Paragraph>

            <Form.Item
              name="itemType"
              label="Item Type"
              rules={[{ required: true, message: 'Please select the item type' }]}
            >
              <Select placeholder="Select the type of item">
                {itemTypes.map(item => (
                  <Option key={item.value} value={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="itemName"
              label="Item Name"
              rules={[{ required: true, message: 'Please enter the item name' }]}
            >
              <Input placeholder="e.g. Vitamins and Supplements" />
            </Form.Item>

            <Form.Item
              name="weight"
              label="Estimated Weight (kg)"
              rules={[{ required: true, message: 'Please enter the estimated weight' }]}
            >
              <InputNumber 
                min={0.1} 
                max={30} 
                step={0.1} 
                style={{ width: '100%' }} 
                placeholder="Enter weight in kg"
              />
            </Form.Item>

            <Divider orientation="left">Estimated Size (Optional)</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="length" label="Length (cm)">
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="Length" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="width" label="Width (cm)">
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="Width" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="height" label="Height (cm)">
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="Height" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="itemPhotos"
              label="Item Photos (Optional)"
              extra="Upload photos of your item (max 3 photos)"
            >
              <Upload
                listType="picture-card"
                maxCount={3}
                beforeUpload={() => false}
                onPreview={() => setPreviewVisible(true)}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              name="itemDescription"
              label="Detailed Description (Optional)"
            >
              <TextArea 
                placeholder="Provide additional details about your item..." 
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Title level={4}>Delivery Information</Title>
            <Paragraph type="secondary">
              Provide details about the sender and recipient for this delivery.
            </Paragraph>

            <Divider orientation="left">Sender Information</Divider>
            
            <Form.Item
              name="requesterName"
              label="Your Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Your full name" />
            </Form.Item>

            <Form.Item
              name="requesterPhone"
              label="Your Phone Number"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Your contact number" />
            </Form.Item>

            <Divider orientation="left">Recipient Information</Divider>

            <Form.Item
              name="recipientName"
              label="Recipient Name"
              rules={[{ required: true, message: 'Please enter recipient name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Recipient's full name" />
            </Form.Item>

            <Form.Item
              name="recipientPhone"
              label="Recipient Phone Number"
              rules={[{ required: true, message: 'Please enter recipient phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Recipient's contact number" />
            </Form.Item>

            <Form.Item
              name="destinationCity"
              label="Destination City"
              rules={[{ required: true, message: 'Please enter the destination city' }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="e.g. Shanghai" />
            </Form.Item>

            <Form.Item
              name="destinationCountry"
              label="Destination Country"
              rules={[{ required: true, message: 'Please select the destination country' }]}
            >
              <Select 
                placeholder="Select country"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="China">China</Option>
                <Option value="USA">United States</Option>
                <Option value="Japan">Japan</Option>
                <Option value="Singapore">Singapore</Option>
                <Option value="UAE">United Arab Emirates</Option>
                <Option value="UK">United Kingdom</Option>
                <Option value="Australia">Australia</Option>
                <Option value="Canada">Canada</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="deliveryMethod"
              label="Preferred Delivery Method"
              rules={[{ required: true, message: 'Please select a delivery method' }]}
            >
              <Radio.Group>
                <Radio.Button value="meet">Meet in Person</Radio.Button>
                <Radio.Button value="courier">Local Courier</Radio.Button>
                <Radio.Button value="home">Home Delivery</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </>
        );

      case 2:
        return (
          <>
            <Title level={4}>Review & Confirm</Title>
            <Paragraph type="secondary">
              Review your delivery request details before confirming.
            </Paragraph>

            <Card className="task-detail-container">
              <div>
                <Text type="secondary">Item Type</Text>
                <Title level={5}>{form.getFieldValue('itemType')}</Title>
              </div>
              
              <Divider />
              
              <div>
                <Text type="secondary">Item Name</Text>
                <Title level={5}>{form.getFieldValue('itemName')}</Title>
              </div>
              
              <div>
                <Text type="secondary">Weight</Text>
                <Title level={5}>{form.getFieldValue('weight')} kg</Title>
              </div>
              
              {(form.getFieldValue('length') && form.getFieldValue('width') && form.getFieldValue('height')) && (
                <div>
                  <Text type="secondary">Size</Text>
                  <Title level={5}>
                    {form.getFieldValue('length')} × {form.getFieldValue('width')} × {form.getFieldValue('height')} cm
                  </Title>
                </div>
              )}
              
              <Divider />
              
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Sender</Text>
                  <Title level={5}>{form.getFieldValue('requesterName')}</Title>
                  <Text>{form.getFieldValue('requesterPhone')}</Text>
                </Col>
                
                <Col span={12}>
                  <Text type="secondary">Recipient</Text>
                  <Title level={5}>{form.getFieldValue('recipientName')}</Title>
                  <Text>{form.getFieldValue('recipientPhone')}</Text>
                  <div>
                    <Text>{form.getFieldValue('destinationCity')}, {form.getFieldValue('destinationCountry')}</Text>
                  </div>
                </Col>
              </Row>
              
              <Divider />
              
              <div>
                <Text type="secondary">Delivery Method</Text>
                <Title level={5}>
                  {form.getFieldValue('deliveryMethod') === 'meet' && 'Meet in Person'}
                  {form.getFieldValue('deliveryMethod') === 'courier' && 'Local Courier'}
                  {form.getFieldValue('deliveryMethod') === 'home' && 'Home Delivery'}
                </Title>
              </div>
              
              {form.getFieldValue('itemDescription') && (
                <>
                  <Divider />
                  <div>
                    <Text type="secondary">Description</Text>
                    <Paragraph>{form.getFieldValue('itemDescription')}</Paragraph>
                  </div>
                </>
              )}
            </Card>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 0' }}>
      <Card className="form-container" bordered={false}>
        <div className="form-steps">
          <Steps current={currentStep}>
            <Step title="Item Information" />
            <Step title="Delivery Info" />
            <Step title="Confirm" />
          </Steps>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            itemType: undefined,
            weight: undefined,
            deliveryMethod: 'meet'
          }}
        >
          {renderStepContent()}

          <div className="form-footer">
            {currentStep > 0 && (
              <Button 
                onClick={prevStep}
                style={{ marginRight: 8 }}
              >
                Previous
              </Button>
            )}
            
            {currentStep < 2 ? (
              <Button 
                type="primary" 
                onClick={nextStep}
              >
                Next <DoubleRightOutlined />
              </Button>
            ) : (
              <Button 
                type="primary" 
                loading={loading}
                onClick={showConfirmModal}
              >
                Submit Request
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTaskPage; 