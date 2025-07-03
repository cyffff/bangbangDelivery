import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Container, 
  FormControl,
  FormHelperText,
  Grid, 
  InputLabel,
  MenuItem,
  Paper, 
  Select,
  Step, 
  StepLabel, 
  Stepper, 
  TextField, 
  Typography,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { 
  DocumentRequest, 
  DocumentType, 
  KycSubmissionRequest, 
  KycVerificationRequest,
  KycVerificationResponse
} from '../../api/kycApi';
import kycApi from '../../api/kycApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const KycSubmissionForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<KycSubmissionRequest>({
    verification: {
      userId: currentUser?.id || 0,
      fullName: '',
      dateOfBirth: '',
      nationality: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      phoneNumber: ''
    },
    documents: []
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [existingVerification, setExistingVerification] = useState<KycVerificationResponse | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        verification: {
          ...prev.verification,
          userId: currentUser.id,
          fullName: currentUser.fullName || '',
          dateOfBirth: currentUser.dateOfBirth || '',
          nationality: currentUser.nationality || '',
          address: currentUser.address || '',
          city: currentUser.city || '',
          country: currentUser.country || '',
          postalCode: currentUser.postalCode || '',
          phoneNumber: currentUser.phoneNumber || ''
        }
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUserVerification = async () => {
      try {
        if (currentUser?.id) {
          const verification = await kycApi.getUserKycVerification(currentUser.id);
          if (verification) {
            setExistingVerification(verification);
            setFormData(prev => ({
              ...prev,
              verification: {
                userId: verification.userId,
                fullName: verification.fullName || '',
                dateOfBirth: verification.dateOfBirth || '',
                nationality: verification.nationality || '',
                address: verification.address || '',
                city: verification.city || '',
                country: verification.country || '',
                postalCode: verification.postalCode || '',
                phoneNumber: verification.phoneNumber || ''
              },
              documents: verification.documents.map(doc => ({
                documentType: doc.documentType,
                documentNumber: doc.documentNumber,
                issueDate: doc.issueDate,
                expiryDate: doc.expiryDate,
                issuingCountry: doc.issuingCountry,
                documentUrl: doc.documentUrl,
                backSideUrl: doc.backSideUrl,
                selfieUrl: doc.selfieUrl
              }))
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user verification:', error);
      }
    };

    fetchUserVerification();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        [name]: value
      }
    }));
  };

  const handleDateOfBirthChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        verification: {
          ...prev.verification,
          dateOfBirth: date.format('YYYY-MM-DD')
        }
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    if (e.target.files && e.target.files[0] && currentUser?.id) {
      const file = e.target.files[0];
      try {
        const response = await kycApi.uploadDocument(currentUser.id, documentType, file);
        const documentIds = [...formData.documents];
        documentIds.push({
          documentType,
          documentNumber: '',
          documentUrl: response.fileUrl
        });
        setFormData(prev => ({
          ...prev,
          documents: documentIds
        }));
      } catch (error) {
        console.error('Error uploading document:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await kycApi.submitKycVerification(formData);
      setSuccess('KYC verification submitted successfully');
      setActiveStep(2);
    } catch (error) {
      console.error('Error submitting KYC verification:', error);
      setErrors({ submit: 'Failed to submit KYC verification' });
    } finally {
      setLoading(false);
    }
  };

  const isPersonalInfoComplete = () => {
    const { verification } = formData;
    return (
      verification.fullName.trim() !== '' &&
      verification.nationality.trim() !== '' &&
      verification.address.trim() !== '' &&
      verification.city.trim() !== '' &&
      verification.country.trim() !== '' &&
      verification.postalCode.trim() !== '' &&
      verification.phoneNumber.trim() !== ''
    );
  };

  const steps = ['Personal Information', 'Document Upload', 'Review & Submit'];

  const renderPersonalInfoForm = () => (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h6">Personal Information</Typography>
        </Grid>

        <Grid xs={12}>
          <TextField
            required
            fullWidth
            id="fullName"
            name="fullName"
            label="Full Name"
            value={formData.verification.fullName}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <DatePicker
            label="Date of Birth"
            value={formData.verification.dateOfBirth ? dayjs(formData.verification.dateOfBirth) : null}
            onChange={handleDateOfBirthChange}
            disableFuture
            slotProps={{
              textField: {
                fullWidth: true,
                required: true
              }
            }}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="nationality"
            name="nationality"
            label="Nationality"
            value={formData.verification.nationality}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid xs={12}>
          <TextField
            required
            fullWidth
            id="address"
            name="address"
            label="Address"
            value={formData.verification.address}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="city"
            name="city"
            label="City"
            value={formData.verification.city}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="country"
            name="country"
            label="Country"
            value={formData.verification.country}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="postalCode"
            name="postalCode"
            label="Postal Code"
            value={formData.verification.postalCode}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            value={formData.verification.phoneNumber}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderDocumentUpload = () => (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h6">Document Upload</Typography>
        </Grid>

        {Object.values(DocumentType).map((type) => (
          <Grid xs={12} key={type}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">{type.replace(/_/g, ' ')}</Typography>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, type)}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderReview = () => (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h6">Review Your Information</Typography>
        </Grid>

        <Grid xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <Typography variant="subtitle1">Personal Information</Typography>
                <Typography>
                  Full Name: {formData.verification.fullName}
                </Typography>
                <Typography>
                  Date of Birth: {formData.verification.dateOfBirth}
                </Typography>
                <Typography>
                  Nationality: {formData.verification.nationality}
                </Typography>
                <Typography>
                  Address: {formData.verification.address}
                </Typography>
                <Typography>
                  City: {formData.verification.city}
                </Typography>
                <Typography>
                  Country: {formData.verification.country}
                </Typography>
                <Typography>
                  Postal Code: {formData.verification.postalCode}
                </Typography>
                <Typography>
                  Phone Number: {formData.verification.phoneNumber}
                </Typography>
              </Grid>

              <Grid xs={12}>
                <Typography variant="subtitle1">Uploaded Documents</Typography>
                {formData.documents.map((doc, index) => (
                  <Typography key={index}>
                    {doc.documentType}: {doc.documentUrl}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPersonalInfoForm();
      case 1:
        return renderDocumentUpload();
      case 2:
        return renderReview();
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (success) {
    return (
      <Alert severity="success">
        {success}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Identity Verification
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph align="center">
        To ensure the security of our platform, we require identity verification
        for all users. This process usually takes 1-3 business days to complete.
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent(activeStep)}
      
      {errors.submit && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.submit}
        </Alert>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 0 && !isPersonalInfoComplete()}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default KycSubmissionForm; 