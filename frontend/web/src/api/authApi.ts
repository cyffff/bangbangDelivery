import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8088/api/v1';

// Enable request/response logging for debugging
const DEBUG = true;

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  profileImageUrl?: string;
  creditScore?: number;
  verificationStatus?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

// Debug logging helper
const logApiCall = (method: string, url: string, data?: any, error?: any) => {
  if (!DEBUG) return;
  
  if (error) {
    console.error(`API ${method} ${url} failed:`, error);
    console.error('Response data:', error.response?.data);
    console.error('Status:', error.response?.status);
  } else {
    console.log(`API ${method} ${url}:`, data || 'No data');
  }
};

// Create an instance of axios with default configuration
const apiClient = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a longer timeout for potentially slow responses
  timeout: 15000,
  // Enable request with credentials (cookies, etc.)
  withCredentials: false
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (DEBUG) {
      console.log(`Request ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, { 
        headers: config.headers,
        data: config.data
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add interceptor to handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`Response from ${response.config.url}:`, {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log the error for debugging
    console.error('API Error:', error.response?.status, error.response?.data);
    
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
    
    // Extract user-friendly error message if available
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'An unexpected error occurred';
      
    return Promise.reject({
      ...error,
      userMessage: errorMessage
    });
  }
);

// Add this parseErrorResponse function to extract meaningful error messages
const parseErrorResponse = (error: any): string => {
  // Check if this is an Axios error
  if (error.response) {
    const { data, status } = error.response;
    
    // Check for specific error patterns in the response
    if (typeof data === 'string' && data.includes('Username already exists')) {
      return 'The username you chose is already taken. Please try a different username.';
    }
    
    // Extract error message from various data formats
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (typeof data === 'string') return data;
    
    // Return status-based messages for common HTTP errors
    if (status === 400) return 'Invalid request data. Please check your information.';
    if (status === 401) return 'Authentication required. Please log in.';
    if (status === 403) return 'You don\'t have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status === 405) return 'This action is not allowed.';
    if (status === 409) return 'This username or email is already registered.';
    if (status === 500) return 'Server error. Please try again later.';
    
    return `Server error (${status}). Please try again later.`;
  }
  
  // Network or connection errors
  if (error.message && error.message.includes('Network Error')) {
    return 'Connection problem: Unable to reach our servers. Please check your internet connection.';
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

export const authApi = {
  /**
   * Login with username/email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    logApiCall('POST', '/login', { username: credentials.username });
    try {
      const response = await apiClient.post('/login', credentials);
      logApiCall('POST', '/login success', response.data);
      
      // Store tokens based on remember option
      if (credentials.remember) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      } else {
        sessionStorage.setItem('token', response.data.accessToken);
        sessionStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      logApiCall('POST', '/login', null, error);
      throw new Error(error.userMessage || 'Login failed. Please check your credentials.');
    }
  },
  
  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    logApiCall('POST', '/register', { 
      username: userData.username,
      email: userData.email
    });
    
    // Generate First/Last name if not present
    if (!userData.firstName || !userData.lastName) {
      const nameParts = userData.username.split(' ');
      if (nameParts.length > 1) {
        userData.firstName = userData.firstName || nameParts[0];
        userData.lastName = userData.lastName || nameParts.slice(1).join(' ');
      } else {
        userData.firstName = userData.firstName || userData.username;
        userData.lastName = userData.lastName || userData.username;
      }
    }
    
    // Enhanced logging for debugging
    console.log('Full registration request data:', {
      ...userData,
      password: '****' // Mask password for security
    });
    
    // Create the registration request config
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Client': 'frontend-web',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 30000, // Increase timeout for debugging
      withCredentials: false // Don't send cookies
    };
    
    // Try multiple endpoint formats in sequence, prioritizing direct API endpoints
    const endpoints = [
      'http://localhost:8081/api/v1/auth/browser-register', // Direct to auth service
      'http://localhost:8088/api/v1/auth/browser-register', // Direct to gateway
      '/api/v1/auth/browser-register',    // API format - relative URL
      `${API_URL}/auth/browser-register`, // Full URL with API_URL
      '/auth/browser-register',           // Frontend format - relative URL
    ];
    
    let lastError = null;
    
    // Try each endpoint in sequence
    for (const endpoint of endpoints) {
      try {
        console.log(`DEBUG: Attempting registration with URL: ${endpoint}`);
        console.log(`DEBUG: Request headers:`, requestConfig.headers);
        
        const startTime = Date.now();
        const response = await axios.post(endpoint, userData, requestConfig);
        const endTime = Date.now();
        
        console.log(`DEBUG: Registration succeeded with endpoint: ${endpoint} in ${endTime - startTime}ms`);
        console.log(`DEBUG: Response status: ${response.status}`);
        console.log(`DEBUG: Response headers:`, response.headers);
        console.log(`DEBUG: Response data:`, response.data);
        
        // Store tokens if they're in the response
        if (response.data?.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        return response.data;
      } catch (error: any) {
        console.error(`DEBUG: Registration failed with endpoint: ${endpoint}`, error);
        
        // Capture full error response for debugging
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        
        // Skip to next endpoint immediately for 405 errors (Method Not Allowed)
        if (error.response?.status === 405) {
          console.log(`DEBUG: Skipping endpoint ${endpoint} due to 405 Method Not Allowed error`);
          continue;
        }
        
        // Parse error message from response
        const friendlyMessage = parseErrorResponse(error);
        
        // Store the error to throw if all endpoints fail
        lastError = {
          ...error,
          userMessage: friendlyMessage,
          endpoint
        };
        
        // Check for "username already exists" error - no need to try other endpoints
        if (error.response?.data && 
            (typeof error.response.data === 'string' && error.response.data.includes('Username already exists') ||
             error.response.data.message?.includes('Username already exists'))) {
          throw {
            ...error,
            userMessage: 'The username you chose is already taken. Please try a different username.',
            fieldError: {
              field: 'username',
              message: 'This username is already taken. Please choose another one.'
            }
          };
        }
      }
    }
    
    // If we've tried all endpoints and they all failed, throw the last error
    if (lastError) {
      throw lastError;
    }
    
    // This should never be reached, but TypeScript might complain
    throw new Error('Registration failed after trying all endpoints');
  },
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      // Clear tokens from storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      
      // Optionally call logout endpoint on the server
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server-side logout fails, we still want to clear local tokens
    }
  },
  
  /**
   * Refresh the access token
   */
  async refreshToken(refreshToken: string): Promise<Partial<AuthResponse>> {
    try {
      const response = await apiClient.post('/refresh-token', { refreshToken });
      return response.data;
    } catch (error: any) {
      throw new Error(error.userMessage || 'Token refresh failed');
    }
  },
  
  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.userMessage || 'Failed to get user profile');
    }
  },
  
  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  }
};

export default authApi; 