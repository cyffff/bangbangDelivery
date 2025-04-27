import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import { PaymentMethod, PaymentRequest, WeChatPayDetails } from '../../types/Payment';
import { paymentApi } from '../../api/paymentApi';
import QRCode from 'react-qr-code';

interface WeChatPaymentFormProps {
  orderId: number;
  amount: number;
  payerId: number;
  receiverId: number;
  onSuccess: (paymentId: number) => void;
  onError: (error: any) => void;
}

const WeChatPaymentForm: React.FC<WeChatPaymentFormProps> = ({
  orderId,
  amount,
  payerId,
  receiverId,
  onSuccess,
  onError
}) => {
  const [openId, setOpenId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleOpenIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenId(event.target.value);
  };

  const initiatePayment = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      const weChatPayDetails: WeChatPayDetails = {
        openId,
        redirectUrl: window.location.origin + '/payment-result'
      };

      const paymentRequest: PaymentRequest = {
        orderId,
        amount,
        payerId,
        receiverId,
        paymentMethod: PaymentMethod.WECHAT_PAY,
        weChatPayDetails
      };

      const response = await paymentApi.initiatePayment(paymentRequest);
      setPaymentId(response.id);
      
      // If a client secret was returned, generate the QR code
      if (response.clientSecret) {
        await generateQRCode(response.id);
      } else if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      } else {
        onSuccess(response.id);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to initiate payment');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateQRCode = async (id: number) => {
    try {
      const response = await paymentApi.generateWeChatQRCode(id);
      setQrCodeUrl(response.qrCodeUrl);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to generate QR code');
      onError(error);
    }
  };

  // Poll payment status every 5 seconds while waiting for user to scan QR code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentId && qrCodeUrl) {
      interval = setInterval(async () => {
        try {
          const payment = await paymentApi.getPaymentById(paymentId);
          if (payment.status === 'COMPLETED') {
            clearInterval(interval);
            onSuccess(paymentId);
          } else if (payment.status === 'FAILED' || payment.status === 'CANCELLED' || payment.status === 'EXPIRED') {
            clearInterval(interval);
            setError(`Payment ${payment.status.toLowerCase()}`);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [paymentId, qrCodeUrl, onSuccess]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          WeChat Pay
        </Typography>
        
        {qrCodeUrl ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Typography variant="body2" gutterBottom>
              Scan this QR code with WeChat to complete payment
            </Typography>
            <Box my={2} p={2} border="1px solid #eaeaea" borderRadius={1}>
              <QRCode value={qrCodeUrl} size={200} />
            </Box>
            <Typography variant="h6" color="primary">
              ¥{amount.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="textSecondary" mt={1}>
              The page will automatically update when payment is complete
            </Typography>
          </Box>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); initiatePayment(); }}>
            <TextField
              fullWidth
              margin="normal"
              label="WeChat OpenID"
              value={openId}
              onChange={handleOpenIdChange}
              placeholder="Enter your WeChat OpenID"
              helperText="Optional: Leave blank to generate QR code payment"
              variant="outlined"
            />
            
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isProcessing}
              sx={{ mt: 2 }}
            >
              {isProcessing ? <CircularProgress size={24} /> : `Pay ¥${amount.toFixed(2)}`}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default WeChatPaymentForm; 