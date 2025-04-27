import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Container, Paper, Typography, Tabs, Tab, Alert, CircularProgress } from '@mui/material';
import CreditCardPaymentForm from '../components/payment/CreditCardPaymentForm';
import WeChatPaymentForm from '../components/payment/WeChatPaymentForm';
import { PaymentMethod } from '../types/Payment';

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get payment details from query params or state
  const amount = parseFloat(queryParams.get('amount') || '0');
  const payerId = parseInt(queryParams.get('payerId') || '0', 10);
  const receiverId = parseInt(queryParams.get('receiverId') || '0', 10);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Validate payment parameters
  useEffect(() => {
    if (!orderId || isNaN(parseInt(orderId, 10)) || amount <= 0 || payerId <= 0 || receiverId <= 0) {
      setError('Invalid payment parameters');
    }
  }, [orderId, amount, payerId, receiverId]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: PaymentMethod) => {
    setSelectedPaymentMethod(newValue);
  };
  
  const handlePaymentSuccess = (paymentId: number) => {
    setSuccess(true);
    setLoading(true);
    
    // Navigate to payment success page after a delay
    setTimeout(() => {
      navigate(`/payment-result/${paymentId}?status=success`);
    }, 1500);
  };
  
  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    setError(error?.response?.data?.message || 'Payment processing failed. Please try again.');
  };
  
  // Render payment method based on selection
  const renderPaymentMethod = () => {
    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }
    
    if (success) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" my={4}>
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Payment successful! Redirecting to order details...
          </Alert>
          <CircularProgress />
        </Box>
      );
    }
    
    const orderIdNum = parseInt(orderId || '0', 10);
    
    switch (selectedPaymentMethod) {
      case PaymentMethod.CREDIT_CARD:
        return (
          <CreditCardPaymentForm
            orderId={orderIdNum}
            amount={amount}
            payerId={payerId}
            receiverId={receiverId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      case PaymentMethod.WECHAT_PAY:
        return (
          <WeChatPaymentForm
            orderId={orderIdNum}
            amount={amount}
            payerId={payerId}
            receiverId={receiverId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      default:
        return <Alert severity="error">Unsupported payment method</Alert>;
    }
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Complete Your Payment
        </Typography>
        
        <Typography variant="h5" gutterBottom align="center" color="primary">
          ${amount.toFixed(2)}
        </Typography>
        
        <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
          Order #{orderId}
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedPaymentMethod}
            onChange={handleTabChange}
            aria-label="payment methods"
            centered
          >
            <Tab 
              label="Credit Card" 
              value={PaymentMethod.CREDIT_CARD} 
              icon={<img src="/images/credit-card-icon.svg" alt="Credit Card" width={24} height={24} />}
              iconPosition="start"
            />
            <Tab 
              label="WeChat Pay" 
              value={PaymentMethod.WECHAT_PAY} 
              icon={<img src="/images/wechat-pay-icon.svg" alt="WeChat Pay" width={24} height={24} />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        {renderPaymentMethod()}
      </Paper>
    </Container>
  );
};

export default PaymentPage; 