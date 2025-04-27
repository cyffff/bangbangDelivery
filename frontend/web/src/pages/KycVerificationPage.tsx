import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Paper, 
  Divider, Button, Chip, CircularProgress,
  List, ListItem, ListItemText, ListItemIcon,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import KycStatusCard from '../components/KycStatusCard';
import { 
  Description as DescriptionIcon,
  CreditCard as CreditCardIcon,
  Home as HomeIcon,
  Face as FaceIcon
} from '@mui/icons-material';

// Mock KYC API and types until backend integration
interface KycVerification {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
}

interface Document {
  id: string;
  documentType: DocumentType;
  description: string;
  verified: boolean;
}

enum DocumentType {
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  NATIONAL_ID = 'NATIONAL_ID',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  OTHER = 'OTHER'
}

enum KycStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

// Mock API service
const kycApi = {
  getUserKycVerification: async (): Promise<KycVerification> => {
    return {
      id: '123',
      status: KycStatus.PENDING,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      nationality: 'United States',
      address: '123 Main St',
      city: 'New York',
      country: 'USA'
    };
  },
  
  getDocumentsByVerificationId: async (id: string): Promise<Document[]> => {
    return [
      {
        id: '1',
        documentType: DocumentType.PASSPORT,
        description: 'Passport',
        verified: true
      },
      {
        id: '2',
        documentType: DocumentType.PROOF_OF_ADDRESS,
        description: 'Utility Bill',
        verified: false
      }
    ];
  }
};

const documentTypeIcons: Record<DocumentType, React.ReactNode> = {
  [DocumentType.PASSPORT]: <FaceIcon />,
  [DocumentType.DRIVERS_LICENSE]: <CreditCardIcon />,
  [DocumentType.NATIONAL_ID]: <CreditCardIcon />,
  [DocumentType.PROOF_OF_ADDRESS]: <HomeIcon />,
  [DocumentType.OTHER]: <DescriptionIcon />
};

const documentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.PASSPORT]: 'Passport',
  [DocumentType.DRIVERS_LICENSE]: 'Driver\'s License',
  [DocumentType.NATIONAL_ID]: 'National ID',
  [DocumentType.PROOF_OF_ADDRESS]: 'Proof of Address',
  [DocumentType.OTHER]: 'Other Document'
};

const KycVerificationPage: React.FC = () => {
  const [verification, setVerification] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationData = async () => {
      setLoading(true);
      try {
        const userVerification = await kycApi.getUserKycVerification();
        setVerification(userVerification);
        
        if (userVerification && userVerification.id) {
          const docs = await kycApi.getDocumentsByVerificationId(userVerification.id);
          setDocuments(docs);
        }
      } catch (err) {
        console.error('Error fetching verification data:', err);
        setError('Could not load your verification data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Identity Verification
        </Typography>
        <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
          <Button 
            component={Link} 
            to="/dashboard" 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Identity Verification
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <KycStatusCard />
        </Grid>
        
        {verification && verification.status !== KycStatus.NOT_SUBMITTED && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {verification.firstName} {verification.lastName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {verification.dateOfBirth ? new Date(verification.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nationality
                  </Typography>
                  <Typography variant="body1">
                    {verification.nationality || 'Not provided'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {verification.address ? (
                      `${verification.address}, ${verification.city}, ${verification.country}`
                    ) : 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
        
        {documents.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Submitted Documents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {documents.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemIcon>
                      {documentTypeIcons[doc.documentType as DocumentType] || <DescriptionIcon />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={documentTypeLabels[doc.documentType as DocumentType] || 'Document'} 
                      secondary={doc.description || 'No description provided'}
                    />
                    <Chip 
                      label={doc.verified ? 'Verified' : 'Pending'} 
                      color={doc.verified ? 'success' : 'warning'} 
                      size="small" 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
        
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            component={Link} 
            to="/dashboard" 
            variant="outlined"
          >
            Back to Dashboard
          </Button>
          
          {(!verification || verification.status === KycStatus.REJECTED || verification.status === KycStatus.EXPIRED) && (
            <Button 
              component={Link} 
              to="/kyc/submit" 
              variant="contained" 
              color="primary"
            >
              {verification ? 'Resubmit Verification' : 'Start Verification'}
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default KycVerificationPage; 