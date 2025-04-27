// Message status enum
export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  DELETED = 'DELETED'
}

// Message data type
export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  subject: string;
  content: string;
  relatedOrderId?: number;
  relatedDemandId?: number;
  relatedJourneyId?: number;
  status: MessageStatus;
  read: boolean;
  archived: boolean;
  parentMessageId?: number;
  createdAt: string;
  updatedAt: string;
}

// Request to create a new message
export interface MessageRequest {
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
  relatedOrderId?: number;
  relatedDemandId?: number;
  relatedJourneyId?: number;
  parentMessageId?: number;
}

// Message thread type for conversation display
export interface MessageThread {
  partnerId: number;
  partnerName: string;
  lastMessage: Message;
  unreadCount: number;
}

// Message pagination response
export interface MessagePaginationResponse {
  content: Message[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
} 