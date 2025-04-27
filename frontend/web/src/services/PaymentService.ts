import { paymentApi } from '../api/paymentApi';
import { orderApi } from '../api/orderApi';
import { 
  PaymentMethod, 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatus 
} from '../types/Payment';
import { Order, OrderStatus } from '../types/Order';

export class PaymentService {
  /**
   * Process a payment for an order
   * @param order Order to process payment for
   * @param payerId ID of the user making the payment
   * @param receiverId ID of the user receiving the payment
   * @param paymentMethod Payment method to use
   * @param paymentDetails Additional payment details
   * @returns Payment response
   */
  public static async processOrderPayment(
    order: Order | number,
    payerId: number,
    receiverId: number,
    paymentMethod: PaymentMethod,
    paymentDetails: any = {}
  ): Promise<PaymentResponse> {
    // Get order if ID was provided
    let orderObject: Order;
    if (typeof order === 'number') {
      orderObject = await orderApi.getOrderById(order);
    } else {
      orderObject = order;
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      orderId: orderObject.id,
      amount: orderObject.price,
      payerId,
      receiverId,
      paymentMethod,
      ...paymentDetails
    };

    // Process payment
    const paymentResponse = await paymentApi.initiatePayment(paymentRequest);

    // If payment is completed, update order status
    if (paymentResponse.status === PaymentStatus.COMPLETED) {
      await this.updateOrderStatusAfterPayment(orderObject.id);
    }

    return paymentResponse;
  }

  /**
   * Get payment status message for user display
   * @param status Payment status
   * @returns User-friendly status message
   */
  public static getPaymentStatusMessage(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'Payment is pending';
      case PaymentStatus.PROCESSING:
        return 'Processing your payment';
      case PaymentStatus.COMPLETED:
        return 'Payment completed successfully';
      case PaymentStatus.FAILED:
        return 'Payment failed. Please try again.';
      case PaymentStatus.CANCELLED:
        return 'Payment was cancelled';
      case PaymentStatus.EXPIRED:
        return 'Payment request expired';
      case PaymentStatus.REFUNDED:
        return 'Payment was refunded';
      case PaymentStatus.PARTIALLY_REFUNDED:
        return 'Payment was partially refunded';
      default:
        return 'Unknown payment status';
    }
  }

  /**
   * Update order status after payment
   * @param orderId ID of the order to update
   */
  private static async updateOrderStatusAfterPayment(orderId: number): Promise<void> {
    try {
      await orderApi.updateOrderStatus(orderId, OrderStatus.PAID);
    } catch (error) {
      console.error('Failed to update order status after payment:', error);
    }
  }

  /**
   * Check if a payment method requires redirect
   * @param method Payment method
   * @returns Whether the method requires redirect
   */
  public static isRedirectPaymentMethod(method: PaymentMethod): boolean {
    return [
      PaymentMethod.WECHAT_PAY,
      PaymentMethod.ALIPAY
    ].includes(method);
  }

  /**
   * Get currency symbol for amount display
   * @param currency Currency code
   * @returns Currency symbol
   */
  public static getCurrencySymbol(currency: string = 'USD'): string {
    switch (currency.toUpperCase()) {
      case 'USD':
        return '$';
      case 'CNY':
      case 'RMB':
        return '¥';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return currency;
    }
  }

  /**
   * Format payment amount for display
   * @param amount Amount to format
   * @param currency Currency code
   * @returns Formatted amount with currency symbol
   */
  public static formatAmount(amount: number, currency: string = 'USD'): string {
    const symbol = this.getCurrencySymbol(currency);
    return `${symbol}${amount.toFixed(2)}`;
  }
} 