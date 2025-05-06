import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Select, Alert, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined, PhoneOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authApi, { RegisterRequest } from '../api/authApi';
import { AppDispatch } from '../store';
import './RegisterPage.css';
import DebugPanel from '../components/DebugPanel';

const { Title, Text } = Typography;
const { Option } = Select;

// Add CSS style object for the animation
const styles = {
  shakeKeyframes: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `,
  shakeAnimation: {
    animation: 'shake 0.4s ease-in-out'
  }
};

interface RegisterFormValues {
  username?: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
}

interface FieldErrors {
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | React.ReactNode>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [lastErrorFields, setLastErrorFields] = useState<(keyof FieldErrors)[]>([]);

  // Add the keyframes to the document head when the component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles.shakeKeyframes;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  const handleFieldChange = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    
    if (error) {
      setError(null);
    }
  };

  useEffect(() => {
    if (lastErrorFields.length > 0) {
      const animateFields = () => {
        lastErrorFields.forEach(field => {
          const formItem = document.querySelector(`#register_${field}`)?.closest('.ant-form-item');
          const inputElement = formItem?.querySelector('input, .ant-select-selector');
          
          if (inputElement) {
            // Type assertion for the element
            const element = inputElement as HTMLElement;
            
            // Apply the animation directly to the style object
            element.style.animation = 'shake 0.4s ease-in-out';
            
            setTimeout(() => {
              // Reset the animation after it completes
              element.style.animation = '';
            }, 500);
          }
        });
      };
      
      // Run animation on next frame
      requestAnimationFrame(animateFields);
    }
  }, [lastErrorFields]);

  const parseErrorMessage = (errorMsg: string): { generalError: string | null, fieldErrors: FieldErrors } => {
    const result = { generalError: null as string | null, fieldErrors: {} as FieldErrors };
    
    // Check for specific field errors based on error message content
    if (errorMsg.toLowerCase().includes('username already exists') || 
        errorMsg.toLowerCase().includes('username is already taken')) {
      result.fieldErrors.username = 'This username is already taken. Please choose another one.';
    } else if (errorMsg.toLowerCase().includes('email already')) {
      result.fieldErrors.email = 'This email is already registered. Please use a different email.';
    } else if (errorMsg.toLowerCase().includes('phone')) {
      result.fieldErrors.phoneNumber = 'Please enter a valid phone number.';
    } else if (errorMsg.toLowerCase().includes('password')) {
      result.fieldErrors.password = 'Please ensure your password meets the requirements.';
    } else if (errorMsg.toLowerCase().includes('first name')) {
      result.fieldErrors.firstName = 'Please enter a valid first name.';
    } else if (errorMsg.toLowerCase().includes('last name')) {
      result.fieldErrors.lastName = 'Please enter a valid last name.';
    } else {
      // If we can't identify a specific field error, use it as a general error
      result.generalError = errorMsg;
    }
    
    return result;
  };

  const onFinish = async (values: RegisterFormValues) => {
    clearErrors();
    setLoading(true);
    
    try {
      // Combine country code and phone number
      const phoneNumber = values.countryCode + values.phoneNumber;
      
      // Create API request payload
      const registrationData: RegisterRequest = {
        username: values.username as string,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: phoneNumber
      };
      
      console.log('DEBUG: Starting registration request with data:', {
        ...registrationData,
        password: '****' // Mask password
      });
      console.log('DEBUG: API_URL from environment:', process.env.REACT_APP_API_URL);
      
      const response = await authApi.register(registrationData);
      console.log('DEBUG: Registration succeeded with response:', response);
      message.success('Registration successful!');
      navigate('/login');
    } catch (error: any) {
      console.error('DEBUG: Registration error details:', error);
      console.error('DEBUG: Error message:', error.message);
      console.error('DEBUG: Error response data:', error.response?.data);
      console.error('DEBUG: Error response status:', error.response?.status);
      
      // Check for field-specific error from the API
      if (error.fieldError) {
        const { field, message } = error.fieldError;
        setFieldErrors({ [field]: message });
        animateErrorFields([field as keyof FieldErrors]);
        setLoading(false);
        return;
      }
      
      // Get the error message, preferring userMessage if available
      const errorMessage = error.userMessage || error.message || 'Registration failed';
      
      // Handle network errors specifically
      if (errorMessage.includes('Network Error') || 
          errorMessage.includes('connect') || 
          errorMessage.includes('unable to reach')) {
        setError(
          <div className="friendly-error">
            <p><strong>Connection Problem</strong>: We're unable to reach our servers.</p>
            <p>Please try:</p>
            <ul>
              <li>Refreshing the page</li>
              <li>Checking your internet connection</li>
              <li>Trying again in a few moments</li>
            </ul>
          </div>
        );
        setLoading(false);
        return;
      }
      
      // Handle "username already exists" error specifically
      if (errorMessage.toLowerCase().includes('username') && 
          (errorMessage.toLowerCase().includes('already exists') || 
           errorMessage.toLowerCase().includes('already taken'))) {
        setFieldErrors({
          username: 'This username is already taken. Please choose another one.'
        });
        animateErrorFields(['username']);
        // Also set a friendly message
        setError(
          <div className="friendly-error">
            <p>The username you've chosen is already in use. Please try a different username.</p>
          </div>
        );
        // Focus the username field
        form.getFieldInstance('username')?.focus();
        setLoading(false);
        return;
      }
      
      // Parse the error message to get field-specific errors
      const { generalError, fieldErrors: parsedFieldErrors } = parseErrorMessage(errorMessage);
      
      if (Object.keys(parsedFieldErrors).length > 0) {
        // Set field-specific errors
        setFieldErrors(prev => ({ ...prev, ...parsedFieldErrors }));
        animateErrorFields(Object.keys(parsedFieldErrors) as (keyof FieldErrors)[]);
        
        // Also set a user-friendly general message
        setError(
          <div className="friendly-error">
            <p>We found some issues with your registration information.</p>
            <p>Please check the highlighted fields and try again.</p>
          </div>
        );
      } else if (generalError) {
        // Set general error with a more user-friendly format
        setError(
          <div className="friendly-error">
            <p><strong>Registration Error</strong></p>
            <p>{generalError}</p>
          </div>
        );
      } else {
        // Fallback to showing a generic user-friendly error
        setError(
          <div className="friendly-error">
            <p><strong>Registration Error</strong></p>
            <p>We encountered an issue while creating your account. Please try again.</p>
          </div>
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation function for error fields
  const animateErrorFields = (fields: (keyof FieldErrors)[]) => {
    // Set the last error fields for animation
    setLastErrorFields(fields);
  };

  // Check for changes in fields to clear errors
  const onValuesChange = (changedValues: Partial<RegisterFormValues>) => {
    // Clear errors for fields that are changed
    Object.keys(changedValues).forEach(key => {
      handleFieldChange(key as keyof FieldErrors);
    });
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <Card className="register-card" bordered={false}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>Create an Account</Title>
            <Text type="secondary">Join BangBang Delivery to ship internationally</Text>
            {/* Version indicator for debugging */}
            <div style={{ fontSize: '10px', color: '#ccc', marginTop: '5px' }}>Version: {new Date().toLocaleString()}</div>
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
              className="registration-error-alert"
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
            onValuesChange={onValuesChange}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter your first name' }]}
              validateStatus={fieldErrors.firstName ? 'error' : undefined}
              help={fieldErrors.firstName}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="First Name" 
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter your last name' }]}
              validateStatus={fieldErrors.lastName ? 'error' : undefined}
              help={fieldErrors.lastName}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Last Name" 
              />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please choose a username' },
                { min: 4, message: 'Username must be at least 4 characters' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
              ]}
              validateStatus={fieldErrors.username ? 'error' : undefined}
              help={fieldErrors.username}
            >
              <Input 
                prefix={<UserAddOutlined className="site-form-item-icon" />} 
                placeholder="Username" 
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
              validateStatus={fieldErrors.email ? 'error' : undefined}
              help={fieldErrors.email}
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
                  validateStatus={fieldErrors.phoneNumber ? 'error' : undefined}
                  help={fieldErrors.phoneNumber}
                >
                  <Input 
                    style={{ width: '70%' }} 
                    placeholder="Phone Number" 
                  />
                </Form.Item>
              </Input.Group>
              {fieldErrors.phoneNumber && (
                <div className="ant-form-item-explain ant-form-item-explain-error">
                  {fieldErrors.phoneNumber}
                </div>
              )}
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter a password' },
                { min: 8, message: 'Password must be at least 8 characters' }
              ]}
              validateStatus={fieldErrors.password ? 'error' : undefined}
              help={fieldErrors.password}
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
      
      {/* Add debug panel */}
      <DebugPanel />
    </div>
  );
};

export default RegisterPage; 