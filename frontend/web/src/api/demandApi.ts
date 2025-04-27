import axios from 'axios';
import { DeliveryDemand } from '../store/slices/demandSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Reuse the API client with interceptors from authApi
const apiClient = axios.create({
  baseURL: `${API_URL}/demands`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface CreateDemandRequest {
  title: string;
  description?: string;
  itemType: string;
  weightKg: number;
  estimatedValue?: number;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  deadline: string;
  rewardAmount: number;
}

export interface UpdateDemandRequest extends Partial<CreateDemandRequest> {
  status?: string;
}

export const demandApi = {
  async getAllDemands(): Promise<DeliveryDemand[]> {
    const response = await apiClient.get('');
    return response.data;
  },

  async getUserDemands(userId: string): Promise<DeliveryDemand[]> {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  async getDemandById(id: string): Promise<DeliveryDemand> {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  async createDemand(demand: CreateDemandRequest): Promise<DeliveryDemand> {
    const response = await apiClient.post('', demand);
    return response.data;
  },

  async updateDemand(id: string, demand: UpdateDemandRequest): Promise<DeliveryDemand> {
    const response = await apiClient.put(`/${id}`, demand);
    return response.data;
  },

  async deleteDemand(id: string): Promise<void> {
    await apiClient.delete(`/${id}`);
  },

  async cancelDemand(id: string): Promise<DeliveryDemand> {
    const response = await apiClient.put(`/${id}/cancel`);
    return response.data;
  },

  async searchDemands(
    params: {
      originCountry?: string;
      originCity?: string;
      destinationCountry?: string;
      destinationCity?: string;
      itemType?: string;
      maxWeight?: number;
      status?: string;
    }
  ): Promise<DeliveryDemand[]> {
    const response = await apiClient.get('/search', { params });
    return response.data;
  },

  async getPopularDemands(): Promise<DeliveryDemand[]> {
    const response = await apiClient.get('/popular');
    return response.data;
  }
};

export default demandApi; 