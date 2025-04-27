import axios from 'axios';
import { message } from 'antd';
import { UserProfile } from './authApi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

export interface UserUpdateData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

// Axios instance configured for user-related API calls
const apiClient = axios.create({
  baseURL: `${API_URL}/users`,
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

// Add interceptor to handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data;
        
        // Update stored tokens
        if (localStorage.getItem('token')) {
          localStorage.setItem('token', accessToken);
        } else {
          sessionStorage.setItem('token', accessToken);
        }
        
        // Update the authorization header
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, logout the user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        message.error('Your session has expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserProfile> {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to get user with ID ${id}`);
    }
  },

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get(`/by-username/${username}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to get user with username ${username}`);
    }
  },

  /**
   * Update user profile
   */
  async updateUser(id: number, userData: UserUpdateData): Promise<UserProfile> {
    try {
      const response = await apiClient.put(`/${id}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user profile');
    }
  },

  /**
   * Update user password
   */
  async updatePassword(id: number, passwordData: PasswordUpdateData): Promise<void> {
    try {
      await apiClient.put(`/${id}`, passwordData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  }
};

export default userApi; 