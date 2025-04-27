import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Tabs, Avatar, Form, Input, Button, message, Spin, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { selectCurrentUser, selectIsAuthLoading, updateUserProfile } from '../store/slices/authSlice';
import { userApi, UserUpdateData, PasswordUpdateData } from '../api/userApi';
import { useAuth } from '../contexts/AuthContext';
import KycStatusCard from '../components/kyc/KycStatusCard';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface UserUpdateFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface PasswordUpdateFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsAuthLoading);
  const { currentUser: authUser } = useAuth();
  
  const [profileForm] = Form.useForm<UserUpdateFormValues>();
  const [passwordForm] = Form.useForm<PasswordUpdateFormValues>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      profileForm.setFieldsValue({
        username: currentUser.username,
        email: currentUser.email,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phoneNumber: currentUser.phoneNumber || ''
      });
    }
  }, [currentUser, profileForm]);

  if (!currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 180px)' }}>
        <Spin size="large" />
      </div>
    );
  }

  const handleProfileUpdate = async (values: UserUpdateFormValues) => {
    try {
      setIsSaving(true);
      const userData: UserUpdateData = { ...values };
      await userApi.updateUser(currentUser.id, userData);
      message.success(t('profile.updateSuccess') as string);
      setIsEditing(false);
      
      // Refresh user data in Redux store
      dispatch(updateUserProfile() as any);
    } catch (error: any) {
      message.error(error.message || t('profile.updateError') as string);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (values: PasswordUpdateFormValues) => {
    try {
      setIsChangingPassword(true);
      
      const passwordData: PasswordUpdateData = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      };
      
      await userApi.updatePassword(currentUser.id, passwordData);
      message.success(t('profile.passwordUpdateSuccess') as string);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('profile.passwordUpdateError') as string);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Row justify="center" style={{ padding: '24px' }}>
      <Col xs={24} sm={24} md={20} lg={18} xl={16}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              {currentUser.profileImageUrl ? (
                <Avatar size={120} src={currentUser.profileImageUrl} />
              ) : (
                <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              )}
              <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                {currentUser.firstName} {currentUser.lastName}
              </Title>
              <Text type="secondary">@{currentUser.username}</Text>
              
              <div style={{ marginTop: 16 }}>
                {currentUser.roles?.map((role: string) => (
                  <Text key={role} style={{ 
                    background: '#f0f2f5', 
                    padding: '4px 12px', 
                    borderRadius: 12,
                    marginRight: 8,
                    display: 'inline-block',
                    fontSize: 12,
                    textTransform: 'uppercase'
                  }}>
                    {role.replace('ROLE_', '')}
                  </Text>
                ))}
              </div>
            </Col>
            
            <Col xs={24} sm={16}>
              <Tabs defaultActiveKey="profile">
                <TabPane tab={t('profile.personalInfo') as string} key="profile">
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleProfileUpdate}
                    disabled={!isEditing}
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="firstName"
                          label={t('profile.firstName') as string}
                          rules={[{ required: true, message: t('validation.required') as string }]}
                        >
                          <Input prefix={<UserOutlined />} />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="lastName"
                          label={t('profile.lastName') as string}
                          rules={[{ required: true, message: t('validation.required') as string }]}
                        >
                          <Input prefix={<UserOutlined />} />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Form.Item
                      name="username"
                      label={t('profile.username') as string}
                      rules={[{ required: true, message: t('validation.required') as string }]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    
                    <Form.Item
                      name="email"
                      label={t('profile.email') as string}
                      rules={[
                        { required: true, message: t('validation.required') as string },
                        { type: 'email', message: t('validation.invalidEmail') as string }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                    
                    <Form.Item
                      name="phoneNumber"
                      label={t('profile.phoneNumber') as string}
                    >
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                    
                    <Form.Item>
                      {isEditing ? (
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          icon={<SaveOutlined />}
                          loading={isSaving}
                        >
                          {t('common.save') as string}
                        </Button>
                      ) : (
                        <Button 
                          type="default" 
                          icon={<EditOutlined />} 
                          onClick={() => setIsEditing(true)}
                        >
                          {t('common.edit') as string}
                        </Button>
                      )}
                      
                      {isEditing && (
                        <Button 
                          style={{ marginLeft: 8 }} 
                          onClick={() => {
                            setIsEditing(false);
                            profileForm.resetFields();
                          }}
                        >
                          {t('common.cancel') as string}
                        </Button>
                      )}
                    </Form.Item>
                  </Form>
                </TabPane>
                
                <TabPane tab={t('profile.security') as string} key="security">
                  <Divider orientation="left">{t('profile.changePassword') as string}</Divider>
                  
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordUpdate}
                  >
                    <Form.Item
                      name="currentPassword"
                      label={t('profile.currentPassword') as string}
                      rules={[{ required: true, message: t('validation.required') as string }]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    
                    <Form.Item
                      name="newPassword"
                      label={t('profile.newPassword') as string}
                      rules={[
                        { required: true, message: t('validation.required') as string },
                        { min: 8, message: t('validation.passwordLength') as string }
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    
                    <Form.Item
                      name="confirmPassword"
                      label={t('profile.confirmPassword') as string}
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: t('validation.required') as string },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(t('validation.passwordMismatch') as string));
                          },
                        })
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>
                    
                    <Form.Item>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isChangingPassword}
                      >
                        {t('profile.updatePassword') as string}
                      </Button>
                    </Form.Item>
                  </Form>
                  
                  <Divider orientation="left">{t('profile.identityVerification') as string || 'Identity Verification'}</Divider>
                  
                  <div style={{ marginBottom: 20 }}>
                    <Text>
                      Your identity verification status determines your transaction limits and access to certain features.
                    </Text>
                  </div>
                  
                  <div className="kyc-status-wrapper" style={{ marginBottom: 20 }}>
                    <KycStatusCard userId={currentUser.id} />
                  </div>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage; 