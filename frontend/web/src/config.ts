// Base API URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Payment configuration
export const PAYMENT_CONFIG = {
  stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_example',
  wechatAppId: process.env.REACT_APP_WECHAT_APP_ID || 'wx_test_id'
};

// App configuration
export const APP_CONFIG = {
  appName: 'BangBang Delivery',
  defaultCurrency: 'USD',
  supportEmail: 'support@bangbang-delivery.com'
};

// Item constants
export const ITEM_CONSTANTS = {
  maxWeight: 100, // kg
  maxVolume: 10, // cubic meters
  minPrice: 1, // dollars
  maxPrice: 10000 // dollars
};

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50]
}; 