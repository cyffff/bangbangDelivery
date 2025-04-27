import axios from 'axios';
import { Order, OrderRequest, OrderStatus } from '../types/Order';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/orders`;

export const orderApi = {
  // Create a new order
  createOrder: async (orderRequest: OrderRequest): Promise<Order> => {
    const response = await axios.post<Order>(API_URL, orderRequest);
    return response.data;
  },

  // Get an order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await axios.get<Order>(`${API_URL}/${id}`);
    return response.data;
  },

  // Get orders by demanderId
  getOrdersByDemanderId: async (demanderId: number): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/demander/${demanderId}`);
    return response.data;
  },

  // Get orders by travelerId
  getOrdersByTravelerId: async (travelerId: number): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/traveler/${travelerId}`);
    return response.data;
  },

  // Get orders by status
  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/status/${status}`);
    return response.data;
  },

  // Get orders by demanderId and status
  getOrdersByDemanderIdAndStatus: async (demanderId: number, status: OrderStatus): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/demander/${demanderId}/status/${status}`);
    return response.data;
  },

  // Get orders by travelerId and status
  getOrdersByTravelerIdAndStatus: async (travelerId: number, status: OrderStatus): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/traveler/${travelerId}/status/${status}`);
    return response.data;
  },

  // Get orders by demandId
  getOrdersByDemandId: async (demandId: number): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/demand/${demandId}`);
    return response.data;
  },

  // Get orders by journeyId
  getOrdersByJourneyId: async (journeyId: number): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/journey/${journeyId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await axios.patch<Order>(`${API_URL}/${id}/status?status=${status}`);
    return response.data;
  },

  // Update order
  updateOrder: async (id: number, orderRequest: OrderRequest): Promise<Order> => {
    const response = await axios.put<Order>(`${API_URL}/${id}`, orderRequest);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
}; 