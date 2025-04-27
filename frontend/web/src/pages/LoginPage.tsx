import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful login
      const userData = {
        id: '1',
        username: 'user1',
        phoneNumber: values.phoneNumber,
        email: 'user1@example.com',
      };
      
      dispatch(login({
        user: userData,
        token: 'mock-jwt-token'
      }));
      
      message.success('Login successful');
      
      // Redirect to the page they tried to visit or home
      navigate(from, { replace: true });
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 0' }}>
      <Card className="form-container" bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>Welcome Back</Title>
          <Text type="secondary">Login to access your account</Text>
        </div>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^\d+$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input 
              prefix={<MobileOutlined className="site-form-item-icon" />} 
              placeholder="Phone Number" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#">Forgot password?</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Log in
            </Button>
          </Form.Item>

          <Divider plain>Or</Divider>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Don't have an account?</Text>{' '}
            <Link to="/register">Register now</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 