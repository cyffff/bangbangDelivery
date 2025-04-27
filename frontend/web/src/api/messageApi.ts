import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Message, MessagePaginationResponse, MessageRequest, MessageThread } from '../types/Message';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/messages`
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const messageApi = {
  // Get all messages for the current user
  getUserMessages: async (
    page = 0,
    size = 10,
    sort = 'createdAt,desc'
  ): Promise<MessagePaginationResponse> => {
    const response = await apiClient.get('', {
      params: { page, size, sort }
    });
    return response.data;
  },

  // Get inbox messages
  getInboxMessages: async (
    userId: number,
    page = 0,
    size = 10
  ): Promise<MessagePaginationResponse> => {
    const response = await apiClient.get(`/inbox/${userId}`, {
      params: { page, size, sort: 'createdAt,desc' }
    });
    return response.data;
  },

  // Get sent messages
  getSentMessages: async (
    userId: number,
    page = 0,
    size = 10
  ): Promise<MessagePaginationResponse> => {
    const response = await apiClient.get(`/sent/${userId}`, {
      params: { page, size, sort: 'createdAt,desc' }
    });
    return response.data;
  },

  // Get archived messages
  getArchivedMessages: async (
    userId: number,
    page = 0,
    size = 10
  ): Promise<MessagePaginationResponse> => {
    const response = await apiClient.get(`/archived/${userId}`, {
      params: { page, size, sort: 'createdAt,desc' }
    });
    return response.data;
  },

  // Get message conversation between two users
  getConversation: async (
    userId: number,
    partnerId: number,
    page = 0,
    size = 20
  ): Promise<MessagePaginationResponse> => {
    const response = await apiClient.get(`/conversation/${userId}/${partnerId}`, {
      params: { page, size, sort: 'createdAt,asc' }
    });
    return response.data;
  },

  // Get message threads (conversations) for a user
  getMessageThreads: async (userId: number): Promise<MessageThread[]> => {
    const response = await apiClient.get(`/threads/${userId}`);
    return response.data;
  },

  // Get single message by id
  getMessage: async (messageId: number): Promise<Message> => {
    const response = await apiClient.get(`/${messageId}`);
    return response.data;
  },

  // Send a new message
  sendMessage: async (messageRequest: MessageRequest): Promise<Message> => {
    const response = await apiClient.post('', messageRequest);
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId: number): Promise<Message> => {
    const response = await apiClient.patch(`/${messageId}/read`);
    return response.data;
  },

  // Archive a message
  archiveMessage: async (messageId: number): Promise<Message> => {
    const response = await apiClient.patch(`/${messageId}/archive`);
    return response.data;
  },

  // Unarchive a message
  unarchiveMessage: async (messageId: number): Promise<Message> => {
    const response = await apiClient.patch(`/${messageId}/unarchive`);
    return response.data;
  },

  // Delete a message (soft delete)
  deleteMessage: async (messageId: number): Promise<void> => {
    await apiClient.delete(`/${messageId}`);
  },

  // Get messages related to an order
  getOrderMessages: async (orderId: number): Promise<Message[]> => {
    const response = await apiClient.get(`/order/${orderId}`);
    return response.data;
  },

  // Get messages related to a demand
  getDemandMessages: async (demandId: number): Promise<Message[]> => {
    const response = await apiClient.get(`/demand/${demandId}`);
    return response.data;
  },

  // Get messages related to a journey
  getJourneyMessages: async (journeyId: number): Promise<Message[]> => {
    const response = await apiClient.get(`/journey/${journeyId}`);
    return response.data;
  }
}; 