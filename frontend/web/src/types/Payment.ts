export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  WECHAT_PAY = 'WECHAT_PAY',
  ALIPAY = 'ALIPAY',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export interface CreditCardDetails {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
}

export interface WeChatPayDetails {
  openId: string;
  redirectUrl: string;
}

export interface PaymentRequest {
  orderId: number;
  amount: number;
  payerId: number;
  receiverId: number;
  paymentMethod: PaymentMethod;
  creditCardDetails?: CreditCardDetails;
  weChatPayDetails?: WeChatPayDetails;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  payerId: number;
  receiverId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  clientSecret?: string;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeResponse {
  paymentId: number;
  qrCodeUrl: string;
  expiresAt: string;
}

export interface RefundRequest {
  paymentId: number;
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  id: number;
  paymentId: number;
  amount: number;
  status: PaymentStatus;
  reason?: string;
  createdAt: string;
}

export const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'blue';
    case PaymentStatus.PROCESSING:
      return 'orange';
    case PaymentStatus.COMPLETED:
      return 'green';
    case PaymentStatus.FAILED:
      return 'red';
    case PaymentStatus.REFUNDED:
      return 'purple';
    case PaymentStatus.PARTIALLY_REFUNDED:
      return 'magenta';
    case PaymentStatus.CANCELLED:
      return 'gray';
    case PaymentStatus.EXPIRED:
      return 'volcano';
    default:
      return 'default';
  }
}; 