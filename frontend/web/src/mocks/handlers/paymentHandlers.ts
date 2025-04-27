import { rest } from 'msw';
import { API_BASE_URL } from '../../config';
import { PaymentMethod, PaymentRequest, PaymentResponse, PaymentStatus, QRCodeResponse, RefundRequest, RefundResponse } from '../../types/Payment';

// In-memory storage for payments
const payments: Record<number, PaymentResponse> = {};
const refunds: Record<number, RefundResponse> = {};
let nextPaymentId = 1;
let nextRefundId = 1;

export const paymentHandlers = [
  // Initiate payment
  rest.post(`${API_BASE_URL}/payments`, (req, res, ctx) => {
    const paymentRequest = req.body as PaymentRequest;
    
    // Validate request
    if (!paymentRequest.orderId || !paymentRequest.amount || !paymentRequest.payerId || !paymentRequest.receiverId) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Missing required fields' })
      );
    }
    
    const paymentId = nextPaymentId++;
    const now = new Date().toISOString();
    
    // Create payment
    const payment: PaymentResponse = {
      id: paymentId,
      orderId: paymentRequest.orderId,
      payerId: paymentRequest.payerId,
      receiverId: paymentRequest.receiverId,
      amount: paymentRequest.amount,
      paymentMethod: paymentRequest.paymentMethod,
      status: PaymentStatus.PENDING,
      createdAt: now,
      updatedAt: now
    };
    
    // Special handling for payment methods
    if (paymentRequest.paymentMethod === PaymentMethod.CREDIT_CARD) {
      // Simulate successful credit card payment
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = `txn_${Math.random().toString(36).substring(2, 10)}`;
    } 
    else if (paymentRequest.paymentMethod === PaymentMethod.WECHAT_PAY) {
      // For WeChat Pay, we'll return a client secret for QR code generation
      payment.clientSecret = `sec_${Math.random().toString(36).substring(2, 15)}`;
    }
    
    // Store the payment
    payments[paymentId] = payment;
    
    return res(
      ctx.status(201),
      ctx.json(payment)
    );
  }),
  
  // Get payment by ID
  rest.get(`${API_BASE_URL}/payments/:paymentId`, (req, res, ctx) => {
    const { paymentId } = req.params;
    const id = parseInt(paymentId as string, 10);
    
    if (!payments[id]) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Payment not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(payments[id])
    );
  }),
  
  // Get payments by order ID
  rest.get(`${API_BASE_URL}/payments/order/:orderId`, (req, res, ctx) => {
    const { orderId } = req.params;
    const id = parseInt(orderId as string, 10);
    
    const orderPayments = Object.values(payments).filter(p => p.orderId === id);
    
    return res(
      ctx.status(200),
      ctx.json(orderPayments)
    );
  }),
  
  // Get payments by payer ID
  rest.get(`${API_BASE_URL}/payments/payer/:payerId`, (req, res, ctx) => {
    const { payerId } = req.params;
    const id = parseInt(payerId as string, 10);
    
    const payerPayments = Object.values(payments).filter(p => p.payerId === id);
    
    return res(
      ctx.status(200),
      ctx.json(payerPayments)
    );
  }),
  
  // Get payments by receiver ID
  rest.get(`${API_BASE_URL}/payments/receiver/:receiverId`, (req, res, ctx) => {
    const { receiverId } = req.params;
    const id = parseInt(receiverId as string, 10);
    
    const receiverPayments = Object.values(payments).filter(p => p.receiverId === id);
    
    return res(
      ctx.status(200),
      ctx.json(receiverPayments)
    );
  }),
  
  // Generate WeChat QR code
  rest.post(`${API_BASE_URL}/payments/:paymentId/wechat-qrcode`, (req, res, ctx) => {
    const { paymentId } = req.params;
    const id = parseInt(paymentId as string, 10);
    
    if (!payments[id]) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Payment not found' })
      );
    }
    
    const payment = payments[id];
    
    if (payment.paymentMethod !== PaymentMethod.WECHAT_PAY) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Payment method is not WeChat Pay' })
      );
    }
    
    // Generate fake QR code URL
    const qrCodeResponse: QRCodeResponse = {
      paymentId: id,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wechatpay:${id}:${payment.amount}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes from now
    };
    
    return res(
      ctx.status(200),
      ctx.json(qrCodeResponse)
    );
  }),
  
  // Process refund
  rest.post(`${API_BASE_URL}/payments/:paymentId/refund`, (req, res, ctx) => {
    const { paymentId } = req.params;
    const id = parseInt(paymentId as string, 10);
    const refundRequest = req.body as RefundRequest;
    
    if (!payments[id]) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Payment not found' })
      );
    }
    
    const payment = payments[id];
    
    if (payment.status !== PaymentStatus.COMPLETED) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Only completed payments can be refunded' })
      );
    }
    
    const refundAmount = refundRequest.amount || payment.amount;
    
    if (refundAmount > payment.amount) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Refund amount cannot exceed payment amount' })
      );
    }
    
    const refundId = nextRefundId++;
    const now = new Date().toISOString();
    
    // Create refund
    const refund: RefundResponse = {
      id: refundId,
      paymentId: id,
      amount: refundAmount,
      status: PaymentStatus.COMPLETED,
      reason: refundRequest.reason,
      createdAt: now
    };
    
    // Update payment status
    if (refundAmount === payment.amount) {
      payment.status = PaymentStatus.REFUNDED;
    } else {
      payment.status = PaymentStatus.PARTIALLY_REFUNDED;
    }
    payment.updatedAt = now;
    
    // Store the refund
    refunds[refundId] = refund;
    
    return res(
      ctx.status(200),
      ctx.json(refund)
    );
  }),
  
  // Update payment status (for testing)
  rest.patch(`${API_BASE_URL}/payments/:paymentId/status`, (req, res, ctx) => {
    const { paymentId } = req.params;
    const id = parseInt(paymentId as string, 10);
    const { status } = req.body as { status: PaymentStatus };
    
    if (!payments[id]) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Payment not found' })
      );
    }
    
    // Update payment status
    payments[id].status = status;
    payments[id].updatedAt = new Date().toISOString();
    
    return res(
      ctx.status(200),
      ctx.json(payments[id])
    );
  })
]; 