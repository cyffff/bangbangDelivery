import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import kycApi, { KycStatus, KycVerificationResponse } from '../../api/kycApi';

interface KycStatusCardProps {
  userId?: number;
  compact?: boolean;
}

const KycStatusCard: React.FC<KycStatusCardProps> = ({ userId, compact = false }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<KycVerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const userIdToFetch = userId || currentUser?.id;
        
        if (!userIdToFetch) {
          setLoading(false);
          return;
        }
        
        const result = await kycApi.getUserKycVerification(userIdToFetch);
        setVerification(result);
      } catch (err) {
        console.error('Error fetching KYC status:', err);
        setError('Unable to load verification status');
      } finally {
        setLoading(false);
      }
    };

    fetchKycStatus();
  }, [userId, currentUser?.id]);

  const getStatusColor = (status?: KycStatus): string => {
    if (!status) return 'default';
    
    switch (status) {
      case KycStatus.APPROVED:
        return 'success';
      case KycStatus.PENDING:
        return 'warning';
      case KycStatus.REJECTED:
        return 'error';
      case KycStatus.EXPIRED:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status?: KycStatus): string => {
    if (!status) return 'Not Started';
    
    switch (status) {
      case KycStatus.APPROVED:
        return 'Verified';
      case KycStatus.PENDING:
        return 'Pending Verification';
      case KycStatus.REJECTED:
        return 'Verification Rejected';
      case KycStatus.EXPIRED:
        return 'Verification Expired';
      default:
        return 'Unknown';
    }
  };

  const getExpiryDate = (): string => {
    if (!verification || !verification.expiresAt) return '';
    
    return new Date(verification.expiresAt).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card variant="outlined" sx={{ mb: 2, p: compact ? 1 : 2 }}>
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={compact ? 24 : 40} />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined" sx={{ mb: 2, p: compact ? 1 : 2 }}>
        <CardContent>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Box display="flex" alignItems="center">
        <Chip 
          label={getStatusLabel(verification?.status)} 
          color={getStatusColor(verification?.status) as any}
          size="small"
          sx={{ mr: 1 }}
        />
        {!verification && (
          <Button 
            component={Link} 
            to="/kyc" 
            size="small" 
            variant="outlined"
          >
            Verify
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Identity Verification
        </Typography>
        
        <Box display="flex" alignItems="center" mb={2}>
          <Chip 
            label={getStatusLabel(verification?.status)} 
            color={getStatusColor(verification?.status) as any}
            sx={{ mr: 2 }}
          />
          {verification?.status === KycStatus.APPROVED && (
            <Typography variant="body2" color="text.secondary">
              Expires: {getExpiryDate()}
            </Typography>
          )}
        </Box>
        
        {verification?.status === KycStatus.APPROVED && (
          <Typography variant="body2" paragraph>
            Your identity has been verified. You have full access to all platform features.
          </Typography>
        )}
        
        {verification?.status === KycStatus.PENDING && (
          <Typography variant="body2" paragraph>
            Your verification is being reviewed by our team. This process typically takes 1-3 business days.
          </Typography>
        )}
        
        {verification?.status === KycStatus.REJECTED && (
          <>
            <Typography variant="body2" paragraph>
              Your verification was rejected. Please submit a new verification with the required corrections.
            </Typography>
            {verification.rejectionReason && (
              <Typography variant="body2" color="error" paragraph>
                Reason: {verification.rejectionReason}
              </Typography>
            )}
          </>
        )}
        
        {verification?.status === KycStatus.EXPIRED && (
          <Typography variant="body2" paragraph>
            Your verification has expired. Please complete a new verification to maintain full access to the platform.
          </Typography>
        )}
        
        {!verification && (
          <Typography variant="body2" paragraph>
            Complete identity verification to unlock all features on the platform, including higher transaction limits.
          </Typography>
        )}
      </CardContent>
      
      <CardActions>
        {(!verification || 
          verification.status === KycStatus.REJECTED || 
          verification.status === KycStatus.EXPIRED) && (
          <Button 
            component={Link} 
            to="/kyc" 
            variant="contained" 
            color="primary"
          >
            {!verification ? 'Start Verification' : 'Resubmit Verification'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default KycStatusCard; 