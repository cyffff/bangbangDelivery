import React from 'react';
import { Paper, Typography, Chip, Box } from '@mui/material';

// Simple placeholder KycStatusCard
const KycStatusCard: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">KYC Verification Status</Typography>
        <Chip 
          label="Pending" 
          color="warning" 
          size="medium"
        />
      </Box>
      <Typography variant="body2" mt={2}>
        Your identity verification is being reviewed. We'll notify you once the verification is complete.
      </Typography>
    </Paper>
  );
};

export default KycStatusCard; 