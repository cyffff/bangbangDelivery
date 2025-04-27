import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { paymentApi } from '../api/paymentApi';
import { PaymentStatus } from '../types/Payment';

const PaymentResultPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get('status');
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!paymentId) {
        setError('No payment ID provided');
        setLoading(false);
        return;
      }

      try {
        const payment = await paymentApi.getPaymentById(parseInt(paymentId, 10));
        setPaymentStatus(payment.status);
        setOrderId(payment.orderId);
      } catch (error) {
        console.error('Error fetching payment:', error);
        setError('Failed to load payment information');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId]);

  const renderResult = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" py={8}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Checking payment status...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" py={8}>
          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
          <Typography variant="h5" color="error" sx={{ mt: 3 }}>
            Error
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
          <Button 
            component={Link} 
            to="/" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 4 }}
          >
            Back to Home
          </Button>
        </Box>
      );
    }

    const isSuccess = paymentStatus === PaymentStatus.COMPLETED || statusParam === 'success';

    if (isSuccess) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" py={8}>
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
          <Typography variant="h4" color="success.main" sx={{ mt: 3 }}>
            Payment Successful
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Your payment has been processed successfully.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Payment ID: {paymentId}
          </Typography>
          {orderId && (
            <Button 
              component={Link} 
              to={`/orders/${orderId}`} 
              variant="contained" 
              color="primary" 
              sx={{ mt: 4 }}
            >
              View Order Details
            </Button>
          )}
        </Box>
      );
    } else {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" py={8}>
          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
          <Typography variant="h4" color="error" sx={{ mt: 3 }}>
            Payment {paymentStatus?.toLowerCase() || 'Failed'}
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            We were unable to process your payment.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Payment ID: {paymentId}
          </Typography>
          {orderId && (
            <Button 
              component={Link} 
              to={`/payment/${orderId}?amount=${queryParams.get('amount') || 0}&payerId=${queryParams.get('payerId') || 0}&receiverId=${queryParams.get('receiverId') || 0}`} 
              variant="contained" 
              color="primary" 
              sx={{ mt: 4 }}
            >
              Try Again
            </Button>
          )}
        </Box>
      );
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Payment Result
        </Typography>
        {renderResult()}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button component={Link} to="/" variant="outlined">
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResultPage; 