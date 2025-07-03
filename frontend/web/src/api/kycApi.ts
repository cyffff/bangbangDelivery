import axios from 'axios';
import { API_BASE_URL } from '../config';

// Enums
export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  INCOMPLETE = 'INCOMPLETE'
}

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
  UTILITY_BILL = 'UTILITY_BILL',
  BANK_STATEMENT = 'BANK_STATEMENT',
  TAX_CERTIFICATE = 'TAX_CERTIFICATE',
  BUSINESS_REGISTRATION = 'BUSINESS_REGISTRATION',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS'
}

// Interfaces
export interface KycVerificationRequest {
  userId: number;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
}

export interface DocumentRequest {
  documentType: DocumentType;
  documentNumber: string;
  issueDate?: string;
  expiryDate?: string;
  issuingCountry?: string;
  documentUrl: string;
  backSideUrl?: string;
  selfieUrl?: string;
}

export interface KycSubmissionRequest {
  verification: KycVerificationRequest;
  documents: DocumentRequest[];
}

export interface DocumentResponse {
  id: number;
  kycVerificationId: number;
  documentType: DocumentType;
  documentNumber: string;
  issueDate?: string;
  expiryDate?: string;
  issuingCountry?: string;
  documentUrl: string;
  backSideUrl?: string;
  selfieUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KycVerificationResponse {
  id: number;
  userId: number;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  status: KycStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  documents: DocumentResponse[];
}

// API Client
const kycApi = {
  // Submit KYC verification
  submitKycVerification: async (request: KycSubmissionRequest): Promise<KycVerificationResponse> => {
    const response = await axios.post(`${API_BASE_URL}/kyc`, request);
    return response.data;
  },

  // Get KYC verification by ID
  getKycVerification: async (verificationId: number): Promise<KycVerificationResponse> => {
    const response = await axios.get(`${API_BASE_URL}/kyc/${verificationId}`);
    return response.data;
  },

  // Get user's KYC verification
  getUserKycVerification: async (userId: number): Promise<KycVerificationResponse> => {
    const response = await axios.get(`${API_BASE_URL}/kyc/user/${userId}`);
    return response.data;
  },

  // Get KYC verifications by status
  getKycVerificationsByStatus: async (status: KycStatus, page = 0, size = 10): Promise<{
    content: KycVerificationResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    const response = await axios.get(`${API_BASE_URL}/kyc/status/${status}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Approve KYC verification
  approveKycVerification: async (verificationId: number, verifierId: number): Promise<KycVerificationResponse> => {
    const response = await axios.put(`${API_BASE_URL}/kyc/${verificationId}/approve`, null, {
      params: { verifierId }
    });
    return response.data;
  },

  // Reject KYC verification
  rejectKycVerification: async (
    verificationId: number,
    verifierId: number,
    reason: string
  ): Promise<KycVerificationResponse> => {
    const response = await axios.put(`${API_BASE_URL}/kyc/${verificationId}/reject`, null, {
      params: { verifierId, reason }
    });
    return response.data;
  },

  // Upload document file
  uploadDocument: async (
    userId: number,
    documentType: string,
    file: File
  ): Promise<{ fileUrl: string }> => {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/kyc/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Check if user is verified
  isUserVerified: async (userId: number): Promise<boolean> => {
    const response = await axios.get(`${API_BASE_URL}/kyc/user/${userId}/verified`);
    return response.data.verified;
  },

  // Get expiring verifications
  getExpiringVerifications: async (): Promise<KycVerificationResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/kyc/expiring`);
    return response.data;
  },

  // Delete KYC verification
  deleteKycVerification: async (verificationId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/kyc/${verificationId}`);
  },

  // Add document to verification
  addDocument: async (
    kycVerificationId: number,
    documentRequest: DocumentRequest
  ): Promise<DocumentResponse> => {
    const response = await axios.post(`${API_BASE_URL}/documents/${kycVerificationId}`, documentRequest);
    return response.data;
  },

  // Get document by ID
  getDocument: async (documentId: number): Promise<DocumentResponse> => {
    const response = await axios.get(`${API_BASE_URL}/documents/${documentId}`);
    return response.data;
  },

  // Get documents by verification ID
  getDocumentsByVerificationId: async (kycVerificationId: number): Promise<DocumentResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/documents/verification/${kycVerificationId}`);
    return response.data;
  },

  // Get documents by verification ID and document type
  getDocumentsByVerificationIdAndType: async (
    kycVerificationId: number,
    documentType: DocumentType
  ): Promise<DocumentResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/documents/verification/${kycVerificationId}/type/${documentType}`);
    return response.data;
  },

  // Upload document file only
  uploadDocumentFile: async (file: File): Promise<{ fileUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update document
  updateDocument: async (
    documentId: number,
    documentRequest: DocumentRequest
  ): Promise<DocumentResponse> => {
    const response = await axios.put(`${API_BASE_URL}/documents/${documentId}`, documentRequest);
    return response.data;
  },

  // Delete document
  deleteDocument: async (documentId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/documents/${documentId}`);
  },

  // Get the list of all document types and their descriptions
  getDocumentTypes: (): { value: DocumentType; label: string; description: string }[] => {
    return [
      {
        value: DocumentType.PASSPORT,
        label: 'Passport',
        description: 'International travel document with photo identification'
      },
      {
        value: DocumentType.NATIONAL_ID,
        label: 'National ID',
        description: 'Official government-issued identity card'
      },
      {
        value: DocumentType.DRIVERS_LICENSE,
        label: 'Driver\'s License',
        description: 'Official driving permit with photo identification'
      },
      {
        value: DocumentType.RESIDENCE_PERMIT,
        label: 'Residence Permit',
        description: 'Official document showing right to reside in a country'
      },
      {
        value: DocumentType.UTILITY_BILL,
        label: 'Utility Bill',
        description: 'Recent utility bill showing name and address (last 3 months)'
      },
      {
        value: DocumentType.BANK_STATEMENT,
        label: 'Bank Statement',
        description: 'Recent bank statement showing name and address (last 3 months)'
      },
      {
        value: DocumentType.TAX_CERTIFICATE,
        label: 'Tax Certificate',
        description: 'Official tax document issued by government tax authority'
      },
      {
        value: DocumentType.BUSINESS_REGISTRATION,
        label: 'Business Registration',
        description: 'Official document showing business registration details'
      },
      {
        value: DocumentType.PROOF_OF_ADDRESS,
        label: 'Proof of Address',
        description: 'Document proving the address of the document holder'
      }
    ];
  }
};

// Export the kycApi object
export { kycApi };
export default kycApi; 