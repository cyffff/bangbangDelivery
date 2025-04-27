import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Divider, 
  Chip, 
  Stack,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent
} from '@mui/material';
import { 
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
  ErrorOutline as ErrorIcon,
  AccessTime as PendingIcon,
  LockOpen as UnverifiedIcon,
  DescriptionOutlined as DocumentIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { kycApi, KycStatus, DocumentType } from '../api/kycApi';

const KycStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [verification, setVerification] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setLoading(true);
        const data = await kycApi.getUserKycVerification();
        setVerification(data);
        
        if (data && data.id) {
          const docs = await kycApi.getDocumentsByVerificationId(data.id);
          setDocuments(docs);
        }
      } catch (error) {
        console.error('Error fetching KYC verification:', error);
        setError('Failed to load verification status');
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartVerification = () => {
    navigate('/kyc/submit');
  };

  const getStatusColor = (status: KycStatus) => {
    switch (status) {
      case KycStatus.APPROVED:
        return 'success';
      case KycStatus.PENDING:
      case KycStatus.INCOMPLETE:
        return 'warning';
      case KycStatus.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getStatusIcon = (status: KycStatus) => {
    switch (status) {
      case KycStatus.APPROVED:
        return <VerifiedIcon color="success" />;
      case KycStatus.PENDING:
        return <PendingIcon color="warning" />;
      case KycStatus.REJECTED:
        return <ErrorIcon color="error" />;
      case KycStatus.INCOMPLETE:
        return <WarningIcon color="warning" />;
      default:
        return <UnverifiedIcon />;
    }
  };

  const getStatusText = (status: KycStatus) => {
    switch (status) {
      case KycStatus.APPROVED:
        return 'Verified';
      case KycStatus.PENDING:
        return 'Pending Review';
      case KycStatus.REJECTED:
        return 'Rejected';
      case KycStatus.INCOMPLETE:
        return 'Incomplete';
      default:
        return 'Not Verified';
    }
  };

  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PASSPORT:
        return 'Passport';
      case DocumentType.DRIVERS_LICENSE:
        return 'Driver\'s License';
      case DocumentType.NATIONAL_ID:
        return 'National ID';
      case DocumentType.RESIDENCE_PERMIT:
        return 'Residence Permit';
      case DocumentType.UTILITY_BILL:
        return 'Utility Bill';
      case DocumentType.BANK_STATEMENT:
        return 'Bank Statement';
      default:
        return 'Other Document';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !verification) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button 
          startIcon={<BackIcon />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom color="error">
            {error || 'No verification information found'}
          </Typography>
          <Typography variant="body1" paragraph>
            You haven't started the identity verification process yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleStartVerification}
          >
            Start Verification
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button 
        startIcon={<BackIcon />} 
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Identity Verification Status
          </Typography>
          <Chip
            icon={getStatusIcon(verification.status)}
            label={getStatusText(verification.status)}
            color={getStatusColor(verification.status) as any}
            variant="outlined"
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {verification.firstName} {verification.lastName}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {verification.dateOfBirth ? format(new Date(verification.dateOfBirth), 'PPP') : 'Not provided'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Nationality
                </Typography>
                <Typography variant="body1">
                  {verification.nationality || 'Not provided'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Address Information
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {verification.address || 'Not provided'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  City
                </Typography>
                <Typography variant="body1">
                  {verification.city || 'Not provided'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Country
                </Typography>
                <Typography variant="body1">
                  {verification.country || 'Not provided'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Submission Date
              </Typography>
              <Typography variant="body1">
                {verification.submissionDate ? format(new Date(verification.submissionDate), 'PPP') : 'Not submitted'}
              </Typography>
            </Box>
            
            {verification.verificationDate && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Verification Date
                </Typography>
                <Typography variant="body1">
                  {format(new Date(verification.verificationDate), 'PPP')}
                </Typography>
              </Box>
            )}
            
            {verification.expirationDate && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Expiration Date
                </Typography>
                <Typography variant="body1">
                  {format(new Date(verification.expirationDate), 'PPP')}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        
        {verification.status === KycStatus.REJECTED && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rejection Reason
            </Typography>
            <Typography variant="body1">
              {verification.rejectionReason || 'The information or documents provided were insufficient. Please resubmit with correct documentation.'}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          {verification.status === KycStatus.REJECTED && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleStartVerification}
            >
              Resubmit Verification
            </Button>
          )}
          
          {verification.status === KycStatus.INCOMPLETE && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleStartVerification}
            >
              Complete Verification
            </Button>
          )}
        </Box>
      </Paper>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Uploaded Documents
          </Typography>
          
          {documents.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No documents have been uploaded.
            </Typography>
          ) : (
            <List>
              {documents.map((doc) => (
                <ListItem key={doc.id} divider>
                  <ListItemIcon>
                    <DocumentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={getDocumentTypeLabel(doc.documentType)}
                    secondary={`Uploaded on: ${format(new Date(doc.uploadDate), 'PPP')}`}
                  />
                  <Chip
                    size="small"
                    label={doc.verified ? 'Verified' : 'Pending'}
                    color={doc.verified ? 'success' : 'warning'}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default KycStatusPage; 