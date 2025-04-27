import axios from 'axios';
import { API_BASE_URL } from '../config';

export enum ReviewType {
  USER = 'USER',
  ORDER = 'ORDER',
  JOURNEY = 'JOURNEY',
  DEMAND = 'DEMAND'
}

export interface ReviewRequest {
  reviewerId: number;
  targetId: number;
  type: ReviewType;
  rating: number;
  comment?: string;
  isPublic?: boolean;
  orderId?: number;
  journeyId?: number;
  demandId?: number;
}

export interface ReviewResponse {
  id: number;
  reviewerId: number;
  reviewerName: string;
  targetId: number;
  targetName: string;
  type: ReviewType;
  rating: number;
  comment: string;
  isPublic: boolean;
  isApproved: boolean;
  orderId?: number;
  journeyId?: number;
  demandId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  targetId: number;
  type: ReviewType;
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ReviewPage {
  content: ReviewResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const reviewApi = {
  // Create a new review
  createReview: async (reviewRequest: ReviewRequest): Promise<ReviewResponse> => {
    const response = await axios.post(`${API_BASE_URL}/reviews`, reviewRequest);
    return response.data;
  },

  // Get a review by ID
  getReview: async (reviewId: number): Promise<ReviewResponse> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/${reviewId}`);
    return response.data;
  },

  // Update an existing review
  updateReview: async (reviewId: number, reviewRequest: ReviewRequest): Promise<ReviewResponse> => {
    const response = await axios.put(`${API_BASE_URL}/reviews/${reviewId}`, reviewRequest);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`);
  },

  // Get reviews submitted by a user
  getReviewsByReviewer: async (reviewerId: number, page = 0, size = 10): Promise<ReviewPage> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/reviewer/${reviewerId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get all reviews for a target
  getReviewsByTarget: async (
    targetId: number, 
    type: ReviewType,
    page = 0,
    size = 10
  ): Promise<ReviewPage> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/target/${targetId}/type/${type}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get public and approved reviews for a target
  getPublicReviewsByTarget: async (
    targetId: number,
    type: ReviewType,
    page = 0,
    size = 10
  ): Promise<ReviewPage> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/public/target/${targetId}/type/${type}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get reviews for an order
  getReviewsByOrder: async (orderId: number, page = 0, size = 10): Promise<ReviewPage> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/order/${orderId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get reviews for a journey
  getReviewsByJourney: async (journeyId: number, page = 0, size = 10): Promise<ReviewPage> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/journey/${journeyId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get reviews for a demand
  getReviewsByDemand: async (demandId: number, page = 0, size = 10): Promise<ReviewPage> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/demand/${demandId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get a summary of reviews for a target
  getReviewSummary: async (targetId: number, type: ReviewType): Promise<ReviewSummary> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/summary/target/${targetId}/type/${type}`);
    return response.data;
  },

  // Approve a review (admin only)
  approveReview: async (reviewId: number): Promise<ReviewResponse> => {
    const response = await axios.put(`${API_BASE_URL}/reviews/${reviewId}/approve`);
    return response.data;
  },

  // Get reviews pending approval (admin only)
  getReviewsPendingApproval: async (): Promise<ReviewResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/pending-approval`);
    return response.data;
  },

  // Check if a user has already reviewed a target
  hasReviewed: async (reviewerId: number, targetId: number, type: ReviewType): Promise<boolean> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/has-reviewed`, {
      params: { reviewerId, targetId, type }
    });
    return response.data;
  }
};

export default reviewApi; 