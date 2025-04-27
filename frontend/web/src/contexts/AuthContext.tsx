import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import kycApi, { KycStatus } from '../api/kycApi';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isKycVerified: boolean;
  kycStatus: KycStatus | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshKycStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);

  const checkKycStatus = async (userId: number) => {
    try {
      const verification = await kycApi.getUserKycVerification(userId);
      if (verification) {
        setKycStatus(verification.status);
      } else {
        setKycStatus(null);
      }
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      setKycStatus(null);
    }
  };

  useEffect(() => {
    // Check if user is already logged in on component mount
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          // Example user - in a real app, you would fetch this from an API
          // For demonstration purposes, we're creating a mock user
          const user: User = {
            id: 1,
            username: 'demouser',
            email: 'demo@example.com',
            roles: ['USER']
          };
          
          setCurrentUser(user);

          // Check KYC status
          await checkKycStatus(user.id);
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const refreshKycStatus = async () => {
    if (currentUser?.id) {
      await checkKycStatus(currentUser.id);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - in a real app, you would call your API here
      // const response = await authApi.login({ username, password });
      
      // Mock successful login
      const token = 'mock-jwt-token';
      localStorage.setItem('accessToken', token);
      
      // Mock user data
      const user: User = {
        id: 1,
        username,
        email: `${username}@example.com`,
        roles: ['USER']
      };
      
      setCurrentUser(user);
      
      // Check KYC status after login
      await checkKycStatus(user.id);
      
      message.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed. Please check your credentials and try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - in a real app, you would call your API here
      // const response = await authApi.register({ username, email, password });
      
      // Mock successful registration
      message.success('Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration failed:', error);
      message.error('Registration failed. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in a real app, you would call your API here
      // await authApi.logout();
      
      // Clear local storage and state
      localStorage.removeItem('accessToken');
      setCurrentUser(null);
      setKycStatus(null);
      message.success('Logout successful!');
    } catch (error) {
      console.error('Logout failed:', error);
      message.error('Logout failed. Please try again later.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isKycVerified = kycStatus === KycStatus.APPROVED;

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isKycVerified,
    kycStatus,
    login,
    register,
    logout,
    refreshKycStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 