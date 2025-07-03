import React from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const KYCForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="kyc"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: 'Please input your full name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="ID Number"
        name="idNumber"
        rules={[{ required: true, message: 'Please input your ID number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="ID Photo"
        name="idPhoto"
        rules={[{ required: true, message: 'Please upload your ID photo!' }]}
      >
        <Upload
          name="idPhoto"
          action="/api/upload"
          listType="picture"
          maxCount={1}
          beforeUpload={(file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
              message.error('You can only upload JPG/PNG files!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error('Image must be smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
          }}
        >
          <Button icon={<UploadOutlined />}>Upload ID Photo</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default KYCForm; 