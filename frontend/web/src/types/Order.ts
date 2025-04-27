export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  ACCEPTED = 'ACCEPTED',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export interface Order {
  id: number;
  demandId: number;
  journeyId: number;
  demanderId: number;
  travelerId: number;
  itemName: string;
  description?: string;
  pickupLocation: string;
  deliveryLocation: string;
  expectedPickupDate: string;
  expectedDeliveryDate: string;
  actualPickupDate?: string;
  actualDeliveryDate?: string;
  weight: number;
  volume: number;
  price: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRequest {
  demandId: number;
  journeyId: number;
  demanderId: number;
  travelerId: number;
  itemName: string;
  description?: string;
  pickupLocation: string;
  deliveryLocation: string;
  expectedPickupDate: string;
  expectedDeliveryDate: string;
  weight: number;
  volume: number;
  price: number;
}

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.CREATED:
      return 'blue';
    case OrderStatus.CONFIRMED:
      return 'cyan';
    case OrderStatus.ACCEPTED:
      return 'processing';
    case OrderStatus.PENDING_PAYMENT:
      return 'warning';
    case OrderStatus.PAID:
      return 'geekblue';
    case OrderStatus.PICKED_UP:
      return 'purple';
    case OrderStatus.IN_TRANSIT:
      return 'orange';
    case OrderStatus.ARRIVED:
      return 'gold';
    case OrderStatus.DELIVERED:
      return 'lime';
    case OrderStatus.COMPLETED:
      return 'green';
    case OrderStatus.CANCELLED:
      return 'red';
    case OrderStatus.DISPUTED:
      return 'volcano';
    default:
      return 'default';
  }
};

export const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  switch (currentStatus) {
    case OrderStatus.CREATED:
      return [OrderStatus.CONFIRMED, OrderStatus.ACCEPTED, OrderStatus.CANCELLED];
    case OrderStatus.CONFIRMED:
      return [OrderStatus.ACCEPTED, OrderStatus.CANCELLED];
    case OrderStatus.ACCEPTED:
      return [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED];
    case OrderStatus.PENDING_PAYMENT:
      return [OrderStatus.PAID, OrderStatus.CANCELLED];
    case OrderStatus.PAID:
      return [OrderStatus.PICKED_UP, OrderStatus.CANCELLED];
    case OrderStatus.PICKED_UP:
      return [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED];
    case OrderStatus.IN_TRANSIT:
      return [OrderStatus.ARRIVED, OrderStatus.CANCELLED, OrderStatus.DISPUTED];
    case OrderStatus.ARRIVED:
      return [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.DISPUTED];
    case OrderStatus.DELIVERED:
      return [OrderStatus.COMPLETED, OrderStatus.DISPUTED];
    case OrderStatus.COMPLETED:
      return [];
    case OrderStatus.CANCELLED:
      return [];
    case OrderStatus.DISPUTED:
      return [OrderStatus.COMPLETED, OrderStatus.CANCELLED];
    default:
      return [];
  }
}; 