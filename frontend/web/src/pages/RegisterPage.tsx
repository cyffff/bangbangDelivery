import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful registration
      const userData = {
        id: '1',
        username: values.username,
        phoneNumber: values.phoneNumber,
        email: values.email,
      };
      
      dispatch(login({
        user: userData,
        token: 'mock-jwt-token'
      }));
      
      message.success('Registration successful');
      navigate('/');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 0' }}>
      <Card className="form-container" bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>Create an Account</Title>
          <Text type="secondary">Join BangBang Delivery to ship internationally</Text>
        </div>

        <Form
          form={form}
          name="register"
          initialValues={{ countryCode: '+1' }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="Full Name" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="site-form-item-icon" />} 
              placeholder="Email" 
            />
          </Form.Item>

          <Form.Item label="Phone Number">
            <Input.Group compact>
              <Form.Item
                name="countryCode"
                noStyle
              >
                <Select style={{ width: '30%' }}>
                  <Option value="+1">+1 (US)</Option>
                  <Option value="+44">+44 (UK)</Option>
                  <Option value="+86">+86 (CN)</Option>
                  <Option value="+81">+81 (JP)</Option>
                  <Option value="+971">+971 (UAE)</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                noStyle
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  { pattern: /^\d+$/, message: 'Phone number should contain only digits' }
                ]}
              >
                <Input 
                  style={{ width: '70%' }} 
                  placeholder="Phone Number" 
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Register
            </Button>
          </Form.Item>

          <Divider plain>Or</Divider>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Already have an account?</Text>{' '}
            <Link to="/login">Login now</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage; 