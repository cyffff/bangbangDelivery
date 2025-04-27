import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import KycSubmissionForm from '../components/kyc/KycSubmissionForm';
import { useNavigate } from 'react-router-dom';

const KycSubmissionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate to KYC status page after successful submission
    setTimeout(() => {
      navigate('/kyc/status');
    }, 2000); // Give user time to see the success message
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Identity Verification
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph align="center">
          To ensure platform security and comply with regulations, we require all users 
          to complete identity verification. This helps prevent fraud and enables us to 
          provide you with the best possible service.
        </Typography>
      </Paper>
      
      <Box mb={4}>
        <KycSubmissionForm onSuccess={handleSuccess} />
      </Box>
    </Container>
  );
};

export default KycSubmissionPage; 