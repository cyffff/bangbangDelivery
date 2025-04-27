import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid';
import kycApi, { KycStatus, KycVerificationResponse, DocumentResponse, DocumentType } from '../api/kycApi';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  AccessTime as PendingIcon,
  ErrorOutline as ErrorIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`kyc-tabpanel-${index}`}
      aria-labelledby={`kyc-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminKycVerificationPage: React.FC = () => {
  const { currentUser, userRoles } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [verifications, setVerifications] = useState<KycVerificationResponse[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<KycVerificationResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    if (!currentUser || !userRoles.includes('ADMIN')) {
      navigate('/login');
      return;
    }

    const fetchVerifications = async () => {
      setLoading(true);
      try {
        const pendingVerifications = await kycApi.getKycVerificationsByStatus(KycStatus.PENDING);
        setVerifications(pendingVerifications);
      } catch (error) {
        console.error('Error fetching verifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, [currentUser, navigate, userRoles]);

  const handleTabChange = async (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setLoading(true);
    
    try {
      let statusToFetch;
      switch (newValue) {
        case 0:
          statusToFetch = KycStatus.PENDING;
          break;
        case 1:
          statusToFetch = KycStatus.APPROVED;
          break;
        case 2:
          statusToFetch = KycStatus.REJECTED;
          break;
        default:
          statusToFetch = KycStatus.PENDING;
      }
      
      const fetchedVerifications = await kycApi.getKycVerificationsByStatus(statusToFetch);
      setVerifications(fetchedVerifications);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (verification: KycVerificationResponse) => {
    setSelectedVerification(verification);
    setViewMode('detail');
    
    try {
      const fetchedDocuments = await kycApi.getDocumentsByVerificationId(verification.id);
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedVerification) return;
    
    setLoading(true);
    try {
      await kycApi.approveKycVerification(selectedVerification.id);
      // Refresh the list
      const updatedVerifications = verifications.filter(v => v.id !== selectedVerification.id);
      setVerifications(updatedVerifications);
      setSelectedVerification(null);
    } catch (error) {
      console.error('Error approving verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRejectDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setDialogOpen(false);
    setRejectReason('');
  };

  const handleReject = async () => {
    if (!selectedVerification) return;
    
    setIsRejecting(true);
    try {
      await kycApi.rejectKycVerification(selectedVerification.id, rejectReason);
      // Refresh the list
      const updatedVerifications = verifications.filter(v => v.id !== selectedVerification.id);
      setVerifications(updatedVerifications);
      setSelectedVerification(null);
      handleCloseRejectDialog();
    } catch (error) {
      console.error('Error rejecting verification:', error);
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusChip = (status: KycStatus) => {
    switch (status) {
      case KycStatus.PENDING:
        return <Chip label="Pending" color="warning" />;
      case KycStatus.APPROVED:
        return <Chip label="Approved" color="success" />;
      case KycStatus.REJECTED:
        return <Chip label="Rejected" color="error" />;
      default:
        return <Chip label="Not Submitted" />;
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'userId', headerName: 'User ID', width: 100 },
    { 
      field: 'fullName', 
      headerName: 'Full Name', 
      flex: 1,
      minWidth: 180 
    },
    { 
      field: 'createdAt', 
      headerName: 'Submitted Date', 
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value as string).toLocaleString();
      }
    },
    { 
      field: 'updatedAt', 
      headerName: 'Last Updated', 
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value as string).toLocaleString();
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        const verification = params.row as KycVerificationResponse;
        return (
          <Box>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ mr: 1 }}
              onClick={() => handleViewDetails(verification)}
            >
              View Details
            </Button>
            
            {tabValue === 0 && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleOpenRejectDialog}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
        );
      }
    }
  ];

  const renderVerificationDetails = () => {
    if (!selectedVerification) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setViewMode('list');
              setSelectedVerification(null);
            }}
          >
            Back to List
          </Button>
          <Box>
            {selectedVerification.status === KycStatus.PENDING && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={handleApprove}
                  sx={{ mr: 1 }}
                  disabled={loading}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={handleOpenRejectDialog}
                  disabled={loading}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body1">
                      {selectedVerification.userId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Box>
                      {getStatusChip(selectedVerification.status)}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedVerification.fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {selectedVerification.dateOfBirth ? 
                        format(new Date(selectedVerification.dateOfBirth), 'PP') : 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nationality
                    </Typography>
                    <Typography variant="body1">
                      {selectedVerification.nationality || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {selectedVerification.address ? 
                        `${selectedVerification.address}, ${selectedVerification.city}, ${selectedVerification.country}` : 
                        'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Postal Code
                    </Typography>
                    <Typography variant="body1">
                      {selectedVerification.postalCode || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {selectedVerification.phoneNumber || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Submission Date
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(selectedVerification.createdAt), 'PP')}
                    </Typography>
                  </Grid>
                  {selectedVerification.verifiedAt && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Verification Date
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(selectedVerification.verifiedAt), 'PP')}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                
                {selectedVerification.rejectionReason && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Rejection Reason:
                    </Typography>
                    <Typography variant="body2">
                      {selectedVerification.rejectionReason}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Documents
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {selectedVerification.documents && selectedVerification.documents.length > 0 ? (
                  <Box>
                    {selectedVerification.documents.map((doc, index) => (
                      <Card key={index} sx={{ mb: 2, borderColor: 'divider', variant: 'outlined' }}>
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {doc.documentType === DocumentType.PASSPORT ? 'Passport' :
                              doc.documentType === DocumentType.DRIVERS_LICENSE ? 'Driver\'s License' :
                              doc.documentType === DocumentType.NATIONAL_ID ? 'National ID' :
                              doc.documentType === DocumentType.PROOF_OF_ADDRESS ? 'Proof of Address' : 'Other Document'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Document Number: {doc.documentNumber || 'Not provided'}
                          </Typography>
                          {doc.issueDate && (
                            <Typography variant="body2" color="text.secondary">
                              Issue Date: {format(new Date(doc.issueDate), 'PP')}
                            </Typography>
                          )}
                          {doc.expiryDate && (
                            <Typography variant="body2" color="text.secondary">
                              Expiry Date: {format(new Date(doc.expiryDate), 'PP')}
                            </Typography>
                          )}
                          {doc.issuingCountry && (
                            <Typography variant="body2" color="text.secondary">
                              Issuing Country: {doc.issuingCountry}
                            </Typography>
                          )}
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            href={doc.fileUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Document
                          </Button>
                          {doc.backSideUrl && (
                            <Button 
                              size="small" 
                              href={doc.backSideUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Back Side
                            </Button>
                          )}
                          {doc.selfieUrl && (
                            <Button 
                              size="small" 
                              href={doc.selfieUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Selfie
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No documents available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderRejectDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={handleCloseRejectDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Reject KYC Verification</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please provide a reason for rejecting this verification. This information will be shared with the user.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Rejection Reason"
          fullWidth
          multiline
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          error={rejectReason === ''}
          helperText={rejectReason === '' ? 'Reason is required' : ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseRejectDialog} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleReject} 
          color="error" 
          disabled={!rejectReason || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        KYC Verification Management
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Pending Verifications
          </Typography>
          {renderDataGrid()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Approved Verifications
          </Typography>
          {renderDataGrid()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Rejected Verifications
          </Typography>
          {renderDataGrid()}
        </TabPanel>
      </Paper>
      
      {viewMode === 'detail' && renderVerificationDetails()}
      {renderRejectDialog()}
    </Container>
  );

  function renderDataGrid() {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      );
    }

    if (verifications.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
          No verifications found.
        </Typography>
      );
    }

    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={verifications}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 }
            }
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
        />
      </div>
    );
  }
};

export default AdminKycVerificationPage; 