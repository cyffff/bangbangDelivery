// Mock KycApi module with proper typing for enums

// Document Type enum
export const DocumentType = {
  PASSPORT: 'PASSPORT',
  DRIVERS_LICENSE: 'DRIVERS_LICENSE',
  NATIONAL_ID: 'NATIONAL_ID',
  PROOF_OF_ADDRESS: 'PROOF_OF_ADDRESS',
  OTHER: 'OTHER'
};

// KYC Status enum 
export const KycStatus = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

// Mock API methods
const kycApi = {
  getUserKycVerification: async () => {
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
  
  getDocumentsByVerificationId: async (id) => {
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

export default kycApi; 