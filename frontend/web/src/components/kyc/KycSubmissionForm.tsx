import React, { useState } from 'react';
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
  Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { 
  DocumentRequest, 
  DocumentType, 
  KycSubmissionRequest, 
  KycVerificationRequest 
} from '../../api/kycApi';
import kycApi from '../../api/kycApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const steps = ['Personal Information', 'Document Upload', 'Review'];

interface DocumentUpload {
  type: DocumentType;
  file: File | null;
  backFile?: File | null;
  selfieFile?: File | null;
  documentNumber: string;
  issueDate?: Dayjs | null;
  expiryDate?: Dayjs | null;
  issuingCountry?: string;
}

interface KycSubmissionFormProps {
  onSuccess?: () => void;
}

const KycSubmissionForm: React.FC<KycSubmissionFormProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<KycVerificationRequest>({
    userId: currentUser?.id || 0,
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phoneNumber: ''
  });
  
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      type: DocumentType.PASSPORT,
      file: null,
      documentNumber: '',
      issueDate: null,
      expiryDate: null,
      issuingCountry: ''
    }
  ]);
  
  const [errors, setErrors] = useState<{
    personalInfo: Partial<Record<keyof KycVerificationRequest, string>>,
    documents: { [key: number]: Partial<Record<keyof DocumentUpload, string>> }
  }>({
    personalInfo: {},
    documents: {}
  });

  const validatePersonalInfo = (): boolean => {
    const newErrors: Partial<Record<keyof KycVerificationRequest, string>> = {};
    let isValid = true;

    if (!personalInfo.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!personalInfo.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    }

    if (!personalInfo.nationality) {
      newErrors.nationality = 'Nationality is required';
      isValid = false;
    }

    if (!personalInfo.address) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!personalInfo.city) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!personalInfo.country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    if (!personalInfo.postalCode) {
      newErrors.postalCode = 'Postal code is required';
      isValid = false;
    }

    if (!personalInfo.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, personalInfo: newErrors }));
    return isValid;
  };

  const validateDocuments = (): boolean => {
    const newErrors: { [key: number]: Partial<Record<keyof DocumentUpload, string>> } = {};
    let isValid = true;

    documents.forEach((doc, index) => {
      const docErrors: Partial<Record<keyof DocumentUpload, string>> = {};

      if (!doc.type) {
        docErrors.type = 'Document type is required';
        isValid = false;
      }

      if (!doc.file) {
        docErrors.file = 'Document file is required';
        isValid = false;
      }

      if (!doc.documentNumber) {
        docErrors.documentNumber = 'Document number is required';
        isValid = false;
      }

      if (doc.type === DocumentType.PASSPORT || 
          doc.type === DocumentType.NATIONAL_ID || 
          doc.type === DocumentType.DRIVERS_LICENSE || 
          doc.type === DocumentType.RESIDENCE_PERMIT) {
        if (!doc.expiryDate) {
          docErrors.expiryDate = 'Expiry date is required';
          isValid = false;
        }
        
        if (!doc.issuingCountry) {
          docErrors.issuingCountry = 'Issuing country is required';
          isValid = false;
        }
      }

      newErrors[index] = docErrors;
    });

    setErrors(prev => ({ ...prev, documents: newErrors }));
    return isValid;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!validatePersonalInfo()) return;
    } else if (activeStep === 1) {
      if (!validateDocuments()) return;
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handlePersonalInfoChange = (field: keyof KycVerificationRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPersonalInfo({
      ...personalInfo,
      [field]: event.target.value
    });
  };

  const handleDateOfBirthChange = (date: Dayjs | null) => {
    setPersonalInfo({
      ...personalInfo,
      dateOfBirth: date ? date.format('YYYY-MM-DD') : ''
    });
  };

  const handleDocumentChange = (index: number, field: keyof DocumentUpload) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: event.target.value };
    setDocuments(updatedDocuments);
  };

  const handleDocumentTypeChange = (index: number) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], type: event.target.value as DocumentType };
    setDocuments(updatedDocuments);
  };

  const handleDocumentDateChange = (index: number, field: 'issueDate' | 'expiryDate') => (date: Dayjs | null) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: date };
    setDocuments(updatedDocuments);
  };

  const handleFileChange = (index: number, fileType: 'file' | 'backFile' | 'selfieFile') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const updatedDocuments = [...documents];
      updatedDocuments[index] = { ...updatedDocuments[index], [fileType]: event.target.files[0] };
      setDocuments(updatedDocuments);
    }
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        type: DocumentType.PASSPORT,
        file: null,
        documentNumber: '',
        issueDate: null,
        expiryDate: null,
        issuingCountry: ''
      }
    ]);
  };

  const removeDocument = (index: number) => {
    if (documents.length === 1) return;
    const updatedDocuments = documents.filter((_, i) => i !== index);
    const updatedErrors = { ...errors };
    delete updatedErrors.documents[index];
    setDocuments(updatedDocuments);
    setErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Prepare documents
      const documentRequests: DocumentRequest[] = documents.map(doc => {
        const request: DocumentRequest = {
          documentType: doc.type,
          documentNumber: doc.documentNumber,
          fileUrl: 'placeholder-url', // This would be replaced by the actual uploaded file URL
          description: `${doc.type} document`
        };
        
        if (doc.expiryDate) {
          request.expiryDate = doc.expiryDate.format('YYYY-MM-DD');
        }
        
        if (doc.issueDate) {
          request.issueDate = doc.issueDate.format('YYYY-MM-DD');
        }
        
        if (doc.issuingCountry) {
          request.issuingCountry = doc.issuingCountry;
        }
        
        return request;
      });
      
      // Upload files first and get URLs (in a real implementation)
      // For each document we would upload the files and get the URLs
      
      // Create the KYC submission request
      const submissionRequest: KycSubmissionRequest = {
        verification: personalInfo,
        documents: documentRequests
      };
      
      // Submit the KYC verification
      await kycApi.submitKycVerification(submissionRequest);
      
      toast.success('KYC verification submitted successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      setActiveStep(activeStep + 1);
    } catch (error) {
      console.error('Error submitting KYC verification:', error);
      toast.error('Failed to submit KYC verification. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfoForm = () => (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>Personal Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={personalInfo.fullName}
            onChange={handlePersonalInfoChange('fullName')}
            error={!!errors.personalInfo.fullName}
            helperText={errors.personalInfo.fullName}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Date of Birth"
            value={personalInfo.dateOfBirth ? dayjs(personalInfo.dateOfBirth) : null}
            onChange={(newValue) => handleDateOfBirthChange(newValue as Dayjs | null)}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                error: !!errors.personalInfo.dateOfBirth,
                helperText: errors.personalInfo.dateOfBirth
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nationality"
            value={personalInfo.nationality}
            onChange={handlePersonalInfoChange('nationality')}
            error={!!errors.personalInfo.nationality}
            helperText={errors.personalInfo.nationality}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={personalInfo.address}
            onChange={handlePersonalInfoChange('address')}
            error={!!errors.personalInfo.address}
            helperText={errors.personalInfo.address}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={personalInfo.city}
            onChange={handlePersonalInfoChange('city')}
            error={!!errors.personalInfo.city}
            helperText={errors.personalInfo.city}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={personalInfo.country}
            onChange={handlePersonalInfoChange('country')}
            error={!!errors.personalInfo.country}
            helperText={errors.personalInfo.country}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            value={personalInfo.postalCode}
            onChange={handlePersonalInfoChange('postalCode')}
            error={!!errors.personalInfo.postalCode}
            helperText={errors.personalInfo.postalCode}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={personalInfo.phoneNumber}
            onChange={handlePersonalInfoChange('phoneNumber')}
            error={!!errors.personalInfo.phoneNumber}
            helperText={errors.personalInfo.phoneNumber}
            required
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderDocumentUploadForm = () => (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>Document Upload</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Please provide clear, legible scans or photos of your identification documents.
        Make sure all details are visible and the entire document is in the frame.
      </Typography>
      
      {documents.map((doc, index) => (
        <Box key={index} mb={4} p={2} border="1px solid #e0e0e0" borderRadius={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">
              Document {index + 1}
            </Typography>
            {documents.length > 1 && (
              <Button 
                color="error" 
                size="small" 
                onClick={() => removeDocument(index)}
              >
                Remove
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                error={!!errors.documents[index]?.type}
                required
              >
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={doc.type}
                  onChange={handleDocumentTypeChange(index) as any}
                  label="Document Type"
                >
                  {kycApi.getDocumentTypes().map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.documents[index]?.type && (
                  <FormHelperText>{errors.documents[index]?.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Number"
                value={doc.documentNumber}
                onChange={handleDocumentChange(index, 'documentNumber')}
                error={!!errors.documents[index]?.documentNumber}
                helperText={errors.documents[index]?.documentNumber}
                required
              />
            </Grid>
            
            {(doc.type === DocumentType.PASSPORT || 
              doc.type === DocumentType.NATIONAL_ID || 
              doc.type === DocumentType.DRIVERS_LICENSE || 
              doc.type === DocumentType.RESIDENCE_PERMIT) && (
              <>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Issue Date"
                    value={doc.issueDate}
                    onChange={(newValue) => handleDocumentDateChange(index, 'issueDate')(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.documents[index]?.issueDate,
                        helperText: errors.documents[index]?.issueDate
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Expiry Date"
                    value={doc.expiryDate}
                    onChange={(newValue) => handleDocumentDateChange(index, 'expiryDate')(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.documents[index]?.expiryDate,
                        helperText: errors.documents[index]?.expiryDate
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Issuing Country"
                    value={doc.issuingCountry || ''}
                    onChange={handleDocumentChange(index, 'issuingCountry' as keyof DocumentUpload)}
                    error={!!errors.documents[index]?.issuingCountry}
                    helperText={errors.documents[index]?.issuingCountry}
                    required
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Typography variant="body2" mb={1}>
                Upload Document Front Side (Max 5MB)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: 56, textTransform: 'none', justifyContent: 'space-between' }}
              >
                {doc.file ? doc.file.name : 'Select File'}
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileChange(index, 'file')}
                />
              </Button>
              {errors.documents[index]?.file && (
                <FormHelperText error>{errors.documents[index]?.file}</FormHelperText>
              )}
            </Grid>
            
            {(doc.type === DocumentType.NATIONAL_ID || 
              doc.type === DocumentType.DRIVERS_LICENSE) && (
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>
                  Upload Document Back Side (Max 5MB)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: 56, textTransform: 'none', justifyContent: 'space-between' }}
                >
                  {doc.backFile ? doc.backFile.name : 'Select File'}
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpeg,application/pdf"
                    onChange={handleFileChange(index, 'backFile')}
                  />
                </Button>
              </Grid>
            )}
            
            {(doc.type === DocumentType.PASSPORT || 
              doc.type === DocumentType.NATIONAL_ID) && (
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>
                  Upload Selfie with Document (Max 5MB)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: 56, textTransform: 'none', justifyContent: 'space-between' }}
                >
                  {doc.selfieFile ? doc.selfieFile.name : 'Select File'}
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpeg"
                    onChange={handleFileChange(index, 'selfieFile')}
                  />
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      ))}
      
      <Button variant="outlined" onClick={addDocument} sx={{ mt: 2 }}>
        Add Another Document
      </Button>
    </Paper>
  );

  const renderReviewForm = () => (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>Review Information</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Please review your information carefully before submission. Once submitted, 
        you cannot make changes until verification is complete or rejected.
      </Typography>
      
      <Typography variant="subtitle1" mt={2} fontWeight="bold">Personal Information</Typography>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Full Name</Typography>
          <Typography variant="body1">{personalInfo.fullName}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
          <Typography variant="body1">{personalInfo.dateOfBirth}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Nationality</Typography>
          <Typography variant="body1">{personalInfo.nationality}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">Address</Typography>
          <Typography variant="body1">{personalInfo.address}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">City</Typography>
          <Typography variant="body1">{personalInfo.city}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Country</Typography>
          <Typography variant="body1">{personalInfo.country}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Postal Code</Typography>
          <Typography variant="body1">{personalInfo.postalCode}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Phone Number</Typography>
          <Typography variant="body1">{personalInfo.phoneNumber}</Typography>
        </Grid>
      </Grid>
      
      <Typography variant="subtitle1" mt={4} mb={2} fontWeight="bold">Documents</Typography>
      {documents.map((doc, index) => (
        <Box key={index} mb={3} p={2} border="1px solid #e0e0e0" borderRadius={1}>
          <Typography variant="subtitle2">Document {index + 1}</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Document Type</Typography>
              <Typography variant="body1">
                {kycApi.getDocumentTypes().find(t => t.value === doc.type)?.label}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Document Number</Typography>
              <Typography variant="body1">{doc.documentNumber}</Typography>
            </Grid>
            {doc.issueDate && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Issue Date</Typography>
                <Typography variant="body1">{doc.issueDate.format('YYYY-MM-DD')}</Typography>
              </Grid>
            )}
            {doc.expiryDate && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Expiry Date</Typography>
                <Typography variant="body1">{doc.expiryDate.format('YYYY-MM-DD')}</Typography>
              </Grid>
            )}
            {doc.issuingCountry && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Issuing Country</Typography>
                <Typography variant="body1">{doc.issuingCountry}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Files</Typography>
              <Typography variant="body1">
                Front: {doc.file?.name || 'None'}<br />
                {doc.backFile && <>Back: {doc.backFile.name}<br /></>}
                {doc.selfieFile && <>Selfie: {doc.selfieFile.name}</>}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Paper>
  );

  const renderSuccessStep = () => (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" color="success.main" gutterBottom>
        Verification Submitted Successfully!
      </Typography>
      <Typography variant="body1" paragraph>
        Your identity verification request has been submitted and is now pending review.
        You will be notified once the verification process is complete.
      </Typography>
    </Paper>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPersonalInfoForm();
      case 1:
        return renderDocumentUploadForm();
      case 2:
        return renderReviewForm();
      case 3:
        return renderSuccessStep();
      default:
        return 'Unknown step';
    }
  };

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
      
      {getStepContent(activeStep)}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0 || activeStep === 3}
          onClick={handleBack}
        >
          Back
        </Button>
        
        {activeStep === steps.length ? (
          <Button 
            variant="contained"
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </Button>
        ) : activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default KycSubmissionForm; 