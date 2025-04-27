import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Select, Alert } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { RegisterRequest } from '../api/authApi';
import { AppDispatch } from '../store';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    setError(null);
    try {
      setLoading(true);
      
      // Prepare registration request
      const registrationRequest: RegisterRequest = {
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName || values.username.split(' ')[0],
        lastName: values.lastName || values.username.split(' ').slice(1).join(' ') || values.username,
        phoneNumber: values.countryCode + values.phoneNumber
      };
      
      // Dispatch register action
      const resultAction = await dispatch(register(registrationRequest));
      
      if (register.fulfilled.match(resultAction)) {
        message.success('Registration successful');
        navigate('/');
      } else if (register.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload || 'Registration failed';
        setError(errorMsg as string);
        message.error('Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
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
        
        {error && (
          <Alert
            message="Registration Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            closable
            onClose={() => setError(null)}
          />
        )}

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