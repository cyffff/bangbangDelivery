import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Typography, Grid, Paper, 
  MenuItem, CircularProgress, Alert, Stepper, Step, 
  StepLabel, FormHelperText, Divider, Container, FormControl, InputLabel, Select, Stack, Chip, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { kycApi, DocumentType, KycSubmissionRequest } from '../api/kycApi';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Delete as DeleteIcon, 
  Upload as UploadIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface DocumentFormState {
  type: DocumentType;
  description: string;
  file: File | null;
  expiryDate: Date | null;
}

interface DocumentTypeInfo {
  type: DocumentType;
  label: string;
  description: string;
  requiresExpiry: boolean;
}

const documentTypes: DocumentTypeInfo[] = [
  { 
    type: DocumentType.PASSPORT, 
    label: 'Passport', 
    description: 'Upload a clear image of your passport', 
    requiresExpiry: true 
  },
  { 
    type: DocumentType.DRIVERS_LICENSE, 
    label: 'Driver\'s License', 
    description: 'Upload front and back of your driver\'s license', 
    requiresExpiry: true 
  },
  { 
    type: DocumentType.NATIONAL_ID, 
    label: 'National ID', 
    description: 'Upload a clear image of your national ID card', 
    requiresExpiry: true 
  },
  { 
    type: DocumentType.PROOF_OF_ADDRESS, 
    label: 'Proof of Address', 
    description: 'Upload a utility bill or bank statement dated within the last 3 months', 
    requiresExpiry: false 
  }
];

interface KycSubmissionFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  documents?: string;
}

interface UploadedDocument {
  id?: string;
  file: File;
  documentType: DocumentType;
  description: string;
  uploaded?: boolean;
}

const KycSubmissionForm: React.FC<KycSubmissionFormProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<KycSubmissionRequest>({
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    nationality: '',
    address: '',
    city: '',
    country: '',
    documents: []
  });
  
  const [documentForm, setDocumentForm] = useState<DocumentFormState>({
    type: DocumentType.PASSPORT,
    description: '',
    file: null,
    expiryDate: null
  });
  
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{
    type: DocumentType;
    description: string;
    expiryDate: Date | null;
    fileUrl?: string;
  }>>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [existingVerification, setExistingVerification] = useState<any>(null);

  useEffect(() => {
    // Pre-fill form with user data if available
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        dateOfBirth: currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth) : null,
        nationality: currentUser.nationality || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        country: currentUser.country || ''
      }));
    }

    const fetchUserVerification = async () => {
      try {
        const verification = await kycApi.getUserKycVerification();
        if (verification) {
          setExistingVerification(verification);
          // Pre-fill form with existing data
          setFormData(prev => ({
            ...prev,
            firstName: verification.firstName || '',
            lastName: verification.lastName || '',
            dateOfBirth: verification.dateOfBirth ? new Date(verification.dateOfBirth) : null,
            nationality: verification.nationality || '',
            address: verification.address || '',
            city: verification.city || '',
            country: verification.country || ''
          }));
          
          // Fetch documents if verification has an ID
          if (verification.id) {
            const docs = await kycApi.getDocumentsByVerificationId(verification.id);
            // Mark existing documents as uploaded
            setUploadedDocuments(docs.map((doc: any) => ({
              type: doc.documentType,
              description: doc.description || '',
              expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null,
              fileUrl: URL.createObjectURL(new File([], doc.filename || 'existing-file'))
            })));
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocumentForm({
      ...documentForm,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentForm({
        ...documentForm,
        file: e.target.files[0]
      });
    }
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedType = e.target.value as DocumentType;
    const typeInfo = documentTypes.find(dt => dt.type === selectedType);
    
    setDocumentForm({
      ...documentForm,
      type: selectedType,
      description: typeInfo?.description || ''
    });
  };

  const handleDateOfBirthChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        dateOfBirth: date
      });
    }
  };

  const handleExpiryDateChange = (date: Date | null) => {
    setDocumentForm({
      ...documentForm,
      expiryDate: date
    });
  };

  const handleAddDocument = async () => {
    if (!documentForm.file) {
      setError('Please upload a document file');
      return;
    }

    const selectedDocType = documentTypes.find(dt => dt.type === documentForm.type);
    
    if (selectedDocType?.requiresExpiry && !documentForm.expiryDate) {
      setError('Please provide an expiry date for this document');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', documentForm.file);
      formData.append('type', documentForm.type);
      formData.append('description', documentForm.description);
      
      if (documentForm.expiryDate) {
        formData.append('expiryDate', documentForm.expiryDate.toISOString());
      }
      
      // This is just temporary for the form state until final submission
      setUploadedDocuments([...uploadedDocuments, {
        type: documentForm.type,
        description: documentForm.description,
        expiryDate: documentForm.expiryDate,
        fileUrl: URL.createObjectURL(documentForm.file)
      }]);
      
      // Reset document form
      setDocumentForm({
        type: DocumentType.PASSPORT,
        description: '',
        file: null,
        expiryDate: null
      });
      
      setSuccess('Document added successfully');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to add document. Please try again.');
      console.error('Error adding document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedDocuments.length === 0) {
      setError('Please add at least one document');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First upload all documents to get their IDs
      const documentIds: string[] = [];
      
      for (const doc of uploadedDocuments) {
        if (!doc.fileUrl) continue;
        
        // In a real implementation, these files would be uploaded to the server
        // For now, we're just simulating the upload
        const documentId = `doc-${Math.random().toString(36).substring(2, 11)}`;
        documentIds.push(documentId);
      }
      
      // Then submit the KYC verification request with document IDs
      await kycApi.submitKycVerification({
        ...formData,
        documents: documentIds
      });
      
      setSuccess('KYC verification submitted successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate('/kyc/status');
        }, 1500);
      }
    } catch (err) {
      setError('Failed to submit KYC verification. Please try again.');
      console.error('Error submitting KYC verification:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isPersonalInfoComplete = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.nationality.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.country.trim() !== ''
    );
  };

  if (success) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Verification Submitted Successfully
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your identity verification has been submitted for review. You'll be notified once the verification is complete.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/kyc/status')}
          >
            View Verification Status
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Personal Information</StepLabel>
          </Step>
          <Step>
            <StepLabel>Upload Documents</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review & Submit</StepLabel>
          </Step>
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {activeStep === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleDateOfBirthChange}
                    disableFuture
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Upload Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please upload clear and valid copies of your identification documents.
              All documents must be in JPG, PNG, or PDF format and less than 5MB.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Document Type"
                  name="type"
                  value={documentForm.type}
                  onChange={handleDocumentTypeChange}
                >
                  {documentTypes.map((option) => (
                    <MenuItem key={option.type} value={option.type}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {documentTypes.find(dt => dt.type === documentForm.type)?.requiresExpiry && (
                    <DatePicker
                      label="Expiry Date"
                      value={documentForm.expiryDate}
                      onChange={handleExpiryDateChange}
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  )}
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={documentForm.description}
                  onChange={handleDocumentInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Document
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {documentForm.file && (
                  <FormHelperText>{documentForm.file.name}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddDocument}
                  disabled={loading || !documentForm.file}
                >
                  {loading ? <CircularProgress size={24} /> : 'Add Document'}
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {uploadedDocuments.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Uploaded Documents ({uploadedDocuments.length})
                </Typography>
                <Grid container spacing={2}>
                  {uploadedDocuments.map((doc, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2">
                          {documentTypes.find(dt => dt.type === doc.type)?.label}
                        </Typography>
                        <Typography variant="body2">
                          {doc.description}
                        </Typography>
                        {doc.expiryDate && (
                          <Typography variant="body2">
                            Expires: {doc.expiryDate.toLocaleDateString()}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}

        {activeStep === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Personal Information</Typography>
                <Typography>
                  Name: {formData.firstName} {formData.lastName}
                </Typography>
                <Typography>
                  Date of Birth: {formData.dateOfBirth.toLocaleDateString()}
                </Typography>
                <Typography>
                  Nationality: {formData.nationality}
                </Typography>
                <Typography>
                  Address: {formData.address}
                </Typography>
                <Typography>
                  City: {formData.city}
                </Typography>
                <Typography>
                  Country: {formData.country}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">
                  Documents ({uploadedDocuments.length})
                </Typography>
                {uploadedDocuments.map((doc, index) => (
                  <Box key={index} sx={{ mt: 1 }}>
                    <Typography>
                      {documentTypes.find(dt => dt.type === doc.type)?.label}
                      {doc.expiryDate && ` (Expires: ${doc.expiryDate.toLocaleDateString()})`}
                    </Typography>
                  </Box>
                ))}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  By submitting this information, you certify that all information provided is accurate and authentic.
                  False information may result in account suspension.
                </Typography>
              </Grid>
            </Grid>
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box>
            {activeStep < 2 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || (activeStep === 0 && !isPersonalInfoComplete()) || (activeStep === 1 && uploadedDocuments.length === 0)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Verification'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default KycSubmissionForm; 