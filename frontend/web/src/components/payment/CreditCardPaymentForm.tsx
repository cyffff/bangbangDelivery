import React, { useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { CreditCardDetails, PaymentMethod, PaymentRequest } from '../../types/Payment';
import { paymentApi } from '../../api/paymentApi';

interface CreditCardPaymentFormProps {
  orderId: number;
  amount: number;
  payerId: number;
  receiverId: number;
  onSuccess: (paymentId: number) => void;
  onError: (error: any) => void;
}

const CreditCardPaymentForm: React.FC<CreditCardPaymentFormProps> = ({
  orderId,
  amount,
  payerId,
  receiverId,
  onSuccess,
  onError
}) => {
  const [cardDetails, setCardDetails] = useState<CreditCardDetails>({
    cardNumber: '',
    cardHolderName: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate card number
    if (!cardDetails.cardNumber || !/^\d{16}$/.test(cardDetails.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Validate cardholder name
    if (!cardDetails.cardHolderName || cardDetails.cardHolderName.trim() === '') {
      newErrors.cardHolderName = 'Cardholder name is required';
    }

    // Validate expiry month
    if (!cardDetails.expirationMonth || !/^(0[1-9]|1[0-2])$/.test(cardDetails.expirationMonth)) {
      newErrors.expirationMonth = 'Invalid month';
    }

    // Validate expiry year
    const currentYear = new Date().getFullYear().toString().slice(-2);
    if (!cardDetails.expirationYear || 
        !/^\d{2}$/.test(cardDetails.expirationYear) || 
        cardDetails.expirationYear < currentYear) {
      newErrors.expirationYear = 'Invalid year';
    }

    // Validate CVV
    if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const paymentRequest: PaymentRequest = {
        orderId,
        amount,
        payerId,
        receiverId,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        creditCardDetails: cardDetails
      };

      const response = await paymentApi.initiatePayment(paymentRequest);
      onSuccess(response.id);
    } catch (error) {
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Credit Card Payment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
                inputProps={{ maxLength: 16 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cardholder Name"
                name="cardHolderName"
                value={cardDetails.cardHolderName}
                onChange={handleInputChange}
                error={!!errors.cardHolderName}
                helperText={errors.cardHolderName}
                placeholder="John Doe"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Expiry Month (MM)"
                name="expirationMonth"
                value={cardDetails.expirationMonth}
                onChange={handleInputChange}
                error={!!errors.expirationMonth}
                helperText={errors.expirationMonth}
                placeholder="MM"
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Expiry Year (YY)"
                name="expirationYear"
                value={cardDetails.expirationYear}
                onChange={handleInputChange}
                error={!!errors.expirationYear}
                helperText={errors.expirationYear}
                placeholder="YY"
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                type="password"
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreditCardPaymentForm; 