import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Statistic,
  Button,
  Tabs,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Divider,
  Alert,
  message,
  DatePicker,
  Skeleton,
  Empty,
  List,
  Tooltip,
  Descriptions,
  Checkbox
} from 'antd';
import {
  ReloadOutlined,
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  BankOutlined,
  CreditCardOutlined,
  FilterOutlined,
  SearchOutlined,
  HistoryOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import './WalletPage.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data - in real application, this would come from an API
const mockTransactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 250.00,
    status: 'completed',
    date: '2023-04-10T14:32:21Z',
    description: 'Deposit from Credit Card',
    reference: 'DEP-202304-001',
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 100.00,
    status: 'completed',
    date: '2023-04-08T09:15:33Z',
    description: 'Withdrawal to Bank Account',
    reference: 'WIT-202304-002',
  },
  {
    id: '3',
    type: 'payment',
    amount: 75.50,
    status: 'completed',
    date: '2023-04-05T11:22:45Z',
    description: 'Payment for Order #ORD-2023-12345',
    reference: 'PAY-202304-003',
  },
  {
    id: '4',
    type: 'earning',
    amount: 120.00,
    status: 'completed',
    date: '2023-04-02T16:44:12Z',
    description: 'Earnings from Journey #JRN-2023-67890',
    reference: 'ERN-202304-004',
  },
  {
    id: '5',
    type: 'withdrawal',
    amount: 50.00,
    status: 'pending',
    date: '2023-04-01T10:30:00Z',
    description: 'Withdrawal to PayPal',
    reference: 'WIT-202304-005',
  },
];

// Add additional mock transaction data
const additionalTransactions = [
  {
    id: '6',
    type: 'deposit',
    amount: 300.00,
    status: 'completed',
    date: '2023-03-28T09:30:00Z',
    description: 'Deposit from Bank Account',
    reference: 'DEP-202303-006',
  },
  {
    id: '7',
    type: 'earning',
    amount: 95.00,
    status: 'completed',
    date: '2023-03-25T16:20:00Z',
    description: 'Earnings from Journey #JRN-2023-54321',
    reference: 'ERN-202303-007',
  },
  {
    id: '8',
    type: 'payment',
    amount: 45.75,
    status: 'failed',
    date: '2023-03-22T11:15:00Z',
    description: 'Payment for Order #ORD-2023-98765 (Failed)',
    reference: 'PAY-202303-008',
  }
];

const allTransactions = [...mockTransactions, ...additionalTransactions];

// Add mock payment methods
const mockPaymentMethods = [
  {
    id: '1',
    type: 'creditCard',
    name: 'John Doe',
    details: '**** **** **** 4242',
    isDefault: true,
    expiryDate: '12/25',
    brand: 'Visa'
  },
  {
    id: '2',
    type: 'bankAccount',
    name: 'John Doe',
    details: '**** **** 6789',
    isDefault: false,
    bankName: 'Chase Bank'
  },
  {
    id: '3',
    type: 'paypal',
    name: 'John Doe',
    details: 'johndoe@example.com',
    isDefault: false
  }
];

const WalletPage: React.FC = () => {
  const { t } = useTranslation();
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [addPaymentMethodModal, setAddPaymentMethodModal] = useState(false);
  const [depositForm] = Form.useForm();
  const [withdrawForm] = Form.useForm();
  const [paymentMethodForm] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactionDetailsVisible, setTransactionDetailsVisible] = useState(false);
  const [editPaymentMethodModal, setEditPaymentMethodModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [editPaymentMethodForm] = Form.useForm();

  // Mock wallet balance data
  const walletBalance = 345.50;
  const pendingBalance = 50.00;
  const availableBalance = walletBalance - pendingBalance;

  // Simulate loading data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTransactions(allTransactions);
        setFilteredTransactions(allTransactions);
      } catch (error) {
        message.error('Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simulate loading payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 800));
        setPaymentMethods(mockPaymentMethods);
      } catch (error) {
        message.error('Failed to load payment methods');
      }
    };

    fetchPaymentMethods();
  }, []);

  // Filter transactions based on search, date range, and type
  useEffect(() => {
    let result = [...transactions];
    
    // Filter by search text
    if (searchText) {
      const lowerCaseSearch = searchText.toLowerCase();
      result = result.filter(
        item =>
          item.description.toLowerCase().includes(lowerCaseSearch) ||
          item.reference.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      result = result.filter(item => {
        const transactionDate = dayjs(item.date);
        return (
          transactionDate.isAfter(dateRange[0], 'day') ||
          transactionDate.isSame(dateRange[0], 'day')
        ) && (
          transactionDate.isBefore(dateRange[1], 'day') ||
          transactionDate.isSame(dateRange[1], 'day')
        );
      });
    }
    
    // Filter by transaction type
    if (transactionTypeFilter) {
      result = result.filter(item => item.type === transactionTypeFilter);
    }
    
    setFilteredTransactions(result);
  }, [transactions, searchText, dateRange, transactionTypeFilter]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('Transaction data refreshed');
    } catch (error) {
      message.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const viewTransactionDetails = (record: any) => {
    setSelectedTransaction(record);
    setTransactionDetailsVisible(true);
  };

  const handleEditPaymentMethod = (method: any) => {
    setSelectedPaymentMethod(method);
    editPaymentMethodForm.setFieldsValue({
      name: method.name,
      isDefault: method.isDefault
    });
    setEditPaymentMethodModal(true);
  };

  const handleUpdatePaymentMethod = async (values: any) => {
    try {
      setProcessing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the payment method in a real app
      // Here we update it in our local state
      const updatedMethods = paymentMethods.map(method => {
        if (method.id === selectedPaymentMethod.id) {
          return { ...method, name: values.name, isDefault: values.isDefault };
        }
        // If this method is set as default, set others to not default
        if (values.isDefault && method.id !== selectedPaymentMethod.id) {
          return { ...method, isDefault: false };
        }
        return method;
      });
      
      setPaymentMethods(updatedMethods);
      setEditPaymentMethodModal(false);
      message.success('Payment method updated successfully');
    } catch (error) {
      message.error('Failed to update payment method');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove the payment method in a real app
      // Here we remove it from our local state
      const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
      setPaymentMethods(updatedMethods);
      message.success('Payment method removed successfully');
    } catch (error) {
      message.error('Failed to remove payment method');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'creditCard':
        return <CreditCardOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
      case 'bankAccount':
        return <BankOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
      case 'paypal':
        return <DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />;
      default:
        return <CreditCardOutlined style={{ fontSize: 24 }} />;
    }
  };

  const renderPaymentMethodsList = () => {
    if (paymentMethods.length === 0) {
      return (
        <Empty
          description="No payment methods added yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3 }}
        dataSource={paymentMethods}
        renderItem={(method) => (
          <List.Item>
            <Card 
              hoverable 
              className="payment-method-card"
              title={
                <Space>
                  {getPaymentMethodIcon(method.type)}
                  <span>{method.type === 'creditCard' ? 'Credit Card' : 
                         method.type === 'bankAccount' ? 'Bank Account' : 'PayPal'}</span>
                  {method.isDefault && (
                    <Tag color="blue">Default</Tag>
                  )}
                </Space>
              }
              actions={[
                <Tooltip title="Edit">
                  <EditOutlined key="edit" onClick={() => handleEditPaymentMethod(method)} />
                </Tooltip>,
                <Tooltip title="Delete">
                  <DeleteOutlined 
                    key="delete" 
                    onClick={() => Modal.confirm({
                      title: 'Delete Payment Method',
                      content: 'Are you sure you want to delete this payment method?',
                      okText: 'Yes',
                      okType: 'danger',
                      cancelText: 'No',
                      onOk: () => handleDeletePaymentMethod(method.id)
                    })} 
                  />
                </Tooltip>
              ]}
            >
              <div className="payment-method-info">
                <p><strong>Name:</strong> {method.name}</p>
                <p><strong>Details:</strong> {method.details}</p>
                {method.type === 'creditCard' && (
                  <p><strong>Expires:</strong> {method.expiryDate}</p>
                )}
                {method.type === 'bankAccount' && method.bankName && (
                  <p><strong>Bank:</strong> {method.bankName}</p>
                )}
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  const columns = [
    {
      title: t('wallet.table.date') || 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: t('wallet.table.type') || 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = '';
        let icon = null;
        let text = '';

        switch (type) {
          case 'deposit':
            color = 'green';
            icon = <ArrowDownOutlined />;
            text = t('wallet.type.deposit') || 'Deposit';
            break;
          case 'withdrawal':
            color = 'orange';
            icon = <ArrowUpOutlined />;
            text = t('wallet.type.withdrawal') || 'Withdrawal';
            break;
          case 'payment':
            color = 'red';
            icon = <ArrowUpOutlined />;
            text = t('wallet.type.payment') || 'Payment';
            break;
          case 'earning':
            color = 'green';
            icon = <ArrowDownOutlined />;
            text = t('wallet.type.earning') || 'Earning';
            break;
          default:
            color = 'default';
            text = type;
        }

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: t('wallet.type.deposit') || 'Deposit', value: 'deposit' },
        { text: t('wallet.type.withdrawal') || 'Withdrawal', value: 'withdrawal' },
        { text: t('wallet.type.payment') || 'Payment', value: 'payment' },
        { text: t('wallet.type.earning') || 'Earning', value: 'earning' },
      ],
      onFilter: (value: any, record: any) => record.type === value,
    },
    {
      title: t('wallet.table.amount') || 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: any) => {
        const isPositive = ['deposit', 'earning'].includes(record.type);
        return (
          <Text style={{ color: isPositive ? '#52c41a' : '#f5222d' }}>
            {isPositive ? '+' : '-'}${amount.toFixed(2)}
          </Text>
        );
      },
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: t('wallet.table.description') || 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('wallet.table.reference') || 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: t('wallet.table.status') || 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let text = '';

        switch (status) {
          case 'completed':
            color = 'green';
            text = t('wallet.status.completed') || 'Completed';
            break;
          case 'pending':
            color = 'orange';
            text = t('wallet.status.pending') || 'Pending';
            break;
          case 'failed':
            color = 'red';
            text = t('wallet.status.failed') || 'Failed';
            break;
          default:
            color = 'default';
            text = status;
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: t('wallet.status.completed') || 'Completed', value: 'completed' },
        { text: t('wallet.status.pending') || 'Pending', value: 'pending' },
        { text: t('wallet.status.failed') || 'Failed', value: 'failed' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          onClick={() => viewTransactionDetails(record)} 
          icon={<InfoCircleOutlined />}
        >
          Details
        </Button>
      )
    }
  ];

  const handleDeposit = async (values: any) => {
    try {
      setProcessing(true);
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success(`Successfully initiated deposit of $${values.amount}`);
      // Add the new transaction to the list
      const newTransaction = {
        id: `${transactions.length + 1}`,
        type: 'deposit',
        amount: values.amount,
        status: 'pending',
        date: new Date().toISOString(),
        description: `Deposit via ${values.paymentMethod === 'creditCard' ? 'Credit Card' : 
                      values.paymentMethod === 'bankTransfer' ? 'Bank Transfer' : 'PayPal'}`,
        reference: `DEP-${dayjs().format('YYYYMM')}-${(transactions.length + 1).toString().padStart(3, '0')}`,
      };
      
      setTransactions([newTransaction, ...transactions]);
      setDepositModalVisible(false);
      depositForm.resetFields();
    } catch (error) {
      message.error('Deposit failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (values: any) => {
    try {
      setProcessing(true);
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (values.amount > availableBalance) {
        throw new Error('Insufficient funds');
      }
      
      message.success(`Withdrawal request of $${values.amount} submitted`);
      // Add the new transaction to the list
      const newTransaction = {
        id: `${transactions.length + 1}`,
        type: 'withdrawal',
        amount: values.amount,
        status: 'pending',
        date: new Date().toISOString(),
        description: `Withdrawal to ${values.withdrawMethod === 'bankAccount' ? 'Bank Account' : 'PayPal'}`,
        reference: `WIT-${dayjs().format('YYYYMM')}-${(transactions.length + 1).toString().padStart(3, '0')}`,
      };
      
      setTransactions([newTransaction, ...transactions]);
      setWithdrawModalVisible(false);
      withdrawForm.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Withdrawal failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleAddPaymentMethod = async (values: any) => {
    try {
      setProcessing(true);
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success(`Payment method added successfully`);
      setAddPaymentMethodModal(false);
      paymentMethodForm.resetFields();
    } catch (error) {
      message.error('Failed to add payment method. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderTransactionFilters = () => (
    <Card style={{ marginBottom: 16, display: filterVisible ? 'block' : 'none' }}>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Search Transactions">
              <Input
                placeholder="Search by description or reference"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Date Range">
              <RangePicker
                style={{ width: '100%' }}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Transaction Type">
              <Select
                placeholder="Select transaction type"
                onChange={value => setTransactionTypeFilter(value)}
                value={transactionTypeFilter || undefined}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="deposit">Deposit</Option>
                <Option value="withdrawal">Withdrawal</Option>
                <Option value="payment">Payment</Option>
                <Option value="earning">Earning</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button 
              onClick={() => {
                setSearchText('');
                setDateRange(null);
                setTransactionTypeFilter('');
              }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  if (loading && transactions.length === 0) {
    return (
      <div>
        <Title level={2}>{t('wallet.title') || 'My Wallet'}</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </Col>
          <Col xs={24}>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <Title level={2}>{t('wallet.title') || 'My Wallet'}</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable className="balance-card">
            <Statistic
              title={t('wallet.totalBalance') || 'Total Balance'}
              value={walletBalance}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#1890ff' }}
            />
            <Divider />
            <div className="balance-details">
              <Text>{t('wallet.availableBalance') || 'Available Balance'}: </Text>
              <Text strong style={{ color: '#52c41a' }}>${availableBalance.toFixed(2)}</Text>
            </div>
            <div className="balance-details">
              <Text>{t('wallet.pendingBalance') || 'Pending Balance'}: </Text>
              <Text type="secondary">${pendingBalance.toFixed(2)}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card hoverable className="action-card">
            <Space style={{ marginBottom: 16 }} wrap>
              <Button
                type="primary"
                icon={<ArrowDownOutlined />}
                onClick={() => setDepositModalVisible(true)}
                size="large"
              >
                {t('wallet.deposit') || 'Deposit'}
              </Button>
              <Button
                icon={<ArrowUpOutlined />}
                onClick={() => setWithdrawModalVisible(true)}
                disabled={availableBalance <= 0}
                size="large"
              >
                {t('wallet.withdraw') || 'Withdraw'}
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={loading}
                size="large"
              >
                {t('wallet.refresh') || 'Refresh'}
              </Button>
            </Space>

            <Alert
              message={t('wallet.depositNote') || 'Note'}
              description={t('wallet.depositDescription') || 'Deposits are typically processed within 1-2 business days. Withdrawal processing time depends on your payment method.'}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="transactions">
          <TabPane
            tab={
              <span>
                <WalletOutlined />
                {t('wallet.tabs.transactions') || 'Transactions'}
              </span>
            }
            key="transactions"
          >
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <Text strong>
                  {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'} found
                </Text>
              </div>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilterVisible(!filterVisible)}
                type={filterVisible ? 'primary' : 'default'}
              >
                {filterVisible ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {renderTransactionFilters()}

            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : filteredTransactions.length > 0 ? (
              <Table
                dataSource={filteredTransactions}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'] }}
                loading={loading}
                scroll={{ x: 'max-content' }}
              />
            ) : (
              <Empty
                description="No transactions found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </TabPane>
          <TabPane
            tab={
              <span>
                <BankOutlined />
                {t('wallet.tabs.paymentMethods') || 'Payment Methods'}
              </span>
            }
            key="paymentMethods"
          >
            <div style={{ padding: '20px 0' }}>
              <Alert
                message={t('wallet.paymentMethodsTitle') || 'Your Payment Methods'}
                description={t('wallet.paymentMethodsDescription') || 'Manage your payment methods for deposit and withdrawal.'}
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text strong>
                  {paymentMethods.length} {paymentMethods.length === 1 ? 'payment method' : 'payment methods'}
                </Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setAddPaymentMethodModal(true)}
                >
                  {t('wallet.addPaymentMethod') || 'Add Payment Method'}
                </Button>
              </div>
              
              {renderPaymentMethodsList()}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Deposit Modal */}
      <Modal
        title={t('wallet.depositFunds') || 'Deposit Funds'}
        open={depositModalVisible}
        onCancel={() => !processing && setDepositModalVisible(false)}
        footer={null}
        maskClosable={!processing}
        closable={!processing}
      >
        <Form form={depositForm} layout="vertical" onFinish={handleDeposit}>
          <Form.Item
            name="amount"
            label={t('wallet.amount') || 'Amount'}
            rules={[
              { required: true, message: t('form.required') || 'Required' },
              { type: 'number', min: 10, message: t('wallet.minDeposit') || 'Minimum deposit is $10' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              placeholder="0.00"
              precision={2}
            />
          </Form.Item>
          
          <Form.Item
            name="paymentMethod"
            label={t('wallet.paymentMethod') || 'Payment Method'}
            rules={[{ required: true, message: t('form.required') || 'Required' }]}
          >
            <Select placeholder={t('wallet.selectPaymentMethod') || 'Select payment method'}>
              <Option value="creditCard">
                <CreditCardOutlined /> {t('wallet.creditCard') || 'Credit Card'}
              </Option>
              <Option value="bankTransfer">
                <BankOutlined /> {t('wallet.bankTransfer') || 'Bank Transfer'}
              </Option>
              <Option value="paypal">
                <DollarOutlined /> PayPal
              </Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={processing} block>
              {t('wallet.proceed') || 'Proceed to Payment'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        title={t('wallet.withdrawFunds') || 'Withdraw Funds'}
        open={withdrawModalVisible}
        onCancel={() => !processing && setWithdrawModalVisible(false)}
        footer={null}
        maskClosable={!processing}
        closable={!processing}
      >
        <Alert
          message={t('wallet.availableToWithdraw') || 'Available to withdraw'}
          description={`$${availableBalance.toFixed(2)} USD`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form form={withdrawForm} layout="vertical" onFinish={handleWithdraw}>
          <Form.Item
            name="amount"
            label={t('wallet.amount') || 'Amount'}
            rules={[
              { required: true, message: t('form.required') || 'Required' },
              { type: 'number', min: 10, message: t('wallet.minWithdrawal') || 'Minimum withdrawal is $10' },
              { 
                type: 'number', 
                max: availableBalance, 
                message: t('wallet.insufficientFunds') || 'Insufficient funds' 
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              placeholder="0.00"
              precision={2}
            />
          </Form.Item>
          
          <Form.Item
            name="withdrawMethod"
            label={t('wallet.withdrawMethod') || 'Withdraw Method'}
            rules={[{ required: true, message: t('form.required') || 'Required' }]}
          >
            <Select placeholder={t('wallet.selectWithdrawMethod') || 'Select withdraw method'}>
              <Option value="bankAccount">
                <BankOutlined /> {t('wallet.bankAccount') || 'Bank Account'}
              </Option>
              <Option value="paypal">
                <DollarOutlined /> PayPal
              </Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={processing} block>
              {t('wallet.requestWithdrawal') || 'Request Withdrawal'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal
        title="Add Payment Method"
        open={addPaymentMethodModal}
        onCancel={() => !processing && setAddPaymentMethodModal(false)}
        footer={null}
        maskClosable={!processing}
        closable={!processing}
      >
        <Form form={paymentMethodForm} layout="vertical" onFinish={handleAddPaymentMethod}>
          <Form.Item
            name="methodType"
            label="Payment Method Type"
            rules={[{ required: true, message: 'Please select payment method type' }]}
          >
            <Select placeholder="Select payment method type">
              <Option value="creditCard">
                <CreditCardOutlined /> Credit Card
              </Option>
              <Option value="bankAccount">
                <BankOutlined /> Bank Account
              </Option>
              <Option value="paypal">
                <DollarOutlined /> PayPal
              </Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Name on Account"
            rules={[{ required: true, message: 'Please enter name on account' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          
          <Form.Item
            name="accountDetails"
            label="Account Details"
            rules={[{ required: true, message: 'Please enter account details' }]}
          >
            <Input placeholder="Account number or email" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={processing} block>
              Add Payment Method
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={transactionDetailsVisible}
        onCancel={() => setTransactionDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTransactionDetailsVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedTransaction && (
          <div className="transaction-details">
            <div className="transaction-header">
              <Space>
                {getStatusIcon(selectedTransaction.status)}
                <Tag color={
                  selectedTransaction.type === 'deposit' || selectedTransaction.type === 'earning' ? 'green' : 
                  selectedTransaction.type === 'withdrawal' ? 'orange' : 'red'
                }>
                  {selectedTransaction.type.toUpperCase()}
                </Tag>
              </Space>
            </div>
            
            <Divider />
            
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Transaction ID">{selectedTransaction.reference}</Descriptions.Item>
              <Descriptions.Item label="Date">{dayjs(selectedTransaction.date).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="Amount">
                <Text style={{ 
                  color: ['deposit', 'earning'].includes(selectedTransaction.type) ? '#52c41a' : '#f5222d',
                  fontWeight: 'bold'
                }}>
                  {['deposit', 'earning'].includes(selectedTransaction.type) ? '+' : '-'}
                  ${selectedTransaction.amount.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Description">{selectedTransaction.description}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  selectedTransaction.status === 'completed' ? 'green' : 
                  selectedTransaction.status === 'pending' ? 'orange' : 'red'
                }>
                  {selectedTransaction.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Edit Payment Method Modal */}
      <Modal
        title="Edit Payment Method"
        open={editPaymentMethodModal}
        onCancel={() => !processing && setEditPaymentMethodModal(false)}
        footer={null}
        maskClosable={!processing}
        closable={!processing}
      >
        <Form 
          form={editPaymentMethodForm} 
          layout="vertical" 
          onFinish={handleUpdatePaymentMethod}
        >
          <Form.Item
            name="name"
            label="Name on Account"
            rules={[{ required: true, message: 'Please enter name on account' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          
          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Set as default payment method</Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={processing} block>
              Update Payment Method
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WalletPage; 