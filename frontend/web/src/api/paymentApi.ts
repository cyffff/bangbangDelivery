import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatus,
  QRCodeResponse,
  RefundRequest,
  RefundResponse
} from '../types/Payment';

// Create axios instance for payment API
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API methods for payment operations
export const paymentApi = {
  // Initiate a new payment
  initiatePayment: async (paymentRequest: PaymentRequest): Promise<PaymentResponse> => {
    const response = await apiClient.post('', paymentRequest);
    return response.data;
  },
  
  // Get payment by ID
  getPaymentById: async (paymentId: number): Promise<PaymentResponse> => {
    const response = await apiClient.get(`/${paymentId}`);
    return response.data;
  },
  
  // Get payments by order ID
  getPaymentsByOrderId: async (orderId: number): Promise<PaymentResponse[]> => {
    const response = await apiClient.get(`/order/${orderId}`);
    return response.data;
  },
  
  // Get payments by payer ID (user who made the payment)
  getPaymentsByPayerId: async (payerId: number): Promise<PaymentResponse[]> => {
    const response = await apiClient.get(`/payer/${payerId}`);
    return response.data;
  },
  
  // Get payments by receiver ID (user who received the payment)
  getPaymentsByReceiverId: async (receiverId: number): Promise<PaymentResponse[]> => {
    const response = await apiClient.get(`/receiver/${receiverId}`);
    return response.data;
  },
  
  // Get payments by status
  getPaymentsByStatus: async (status: PaymentStatus): Promise<PaymentResponse[]> => {
    const response = await apiClient.get(`/status/${status}`);
    return response.data;
  },
  
  // Process a refund
  refundPayment: async (
    paymentId: number, 
    amount?: number, 
    reason?: string
  ): Promise<RefundResponse> => {
    const refundRequest: RefundRequest = {
      paymentId,
      amount,
      reason
    };
    const response = await apiClient.post(`/${paymentId}/refund`, refundRequest);
    return response.data;
  },
  
  // Generate WeChat Pay QR code
  generateWeChatQRCode: async (paymentId: number): Promise<QRCodeResponse> => {
    const response = await apiClient.post(`/${paymentId}/wechat-qrcode`);
    return response.data;
  },
  
  // Update payment status (mostly for testing)
  updatePaymentStatus: async (paymentId: number, status: PaymentStatus): Promise<PaymentResponse> => {
    const response = await apiClient.patch(`/${paymentId}/status`, { status });
    return response.data;
  }
}; 