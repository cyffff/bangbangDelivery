import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const MATCHING_API = `${API_URL}/api/v1/matches`;

// Get auth header helper function
const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Types
export interface Match {
  id: number;
  demandId: string;
  journeyId: number;
  demandUserId: string;
  journeyUserId: number;
  status: string;
  matchScore: number;
  demanderConfirmed: boolean;
  travelerConfirmed: boolean;
  matchedAt: string;
  confirmedAt: string | null;
  rejectedAt: string | null;
  updatedAt: string;
  demand: Demand;
  journey: Journey;
}

export interface Demand {
  id: string;
  userId: string;
  title: string;
  description: string;
  itemType: string;
  weightKg: number;
  estimatedValue: number;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  deadline: string;
  rewardAmount: number;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Journey {
  id: number;
  userId: number;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  departureDate: string;
  arrivalDate: string;
  availableWeight: number;
  availableVolume: number;
  notes: string;
  preferredItemTypes: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchConfirmRequest {
  confirmed: boolean;
}

const matchingApi = {
  // Get all matches for the current user
  getMyMatches: async (): Promise<Match[]> => {
    const response = await axios.get(`${MATCHING_API}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Get matches for the current user by status
  getMyMatchesByStatus: async (status: string): Promise<Match[]> => {
    const response = await axios.get(`${MATCHING_API}/status/${status}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Get a specific match by ID
  getMatchById: async (id: number): Promise<Match> => {
    const response = await axios.get(`${MATCHING_API}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Get matches for a specific demand
  getMatchesByDemandId: async (demandId: string): Promise<Match[]> => {
    const response = await axios.get(`${MATCHING_API}/demand/${demandId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Get matches for a specific journey
  getMatchesByJourneyId: async (journeyId: number): Promise<Match[]> => {
    const response = await axios.get(`${MATCHING_API}/journey/${journeyId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Find potential matches for a demand
  findMatchesForDemand: async (demandId: string): Promise<Match[]> => {
    const response = await axios.post(`${MATCHING_API}/demand/${demandId}/find`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Find potential matches for a journey
  findMatchesForJourney: async (journeyId: number): Promise<Match[]> => {
    const response = await axios.post(`${MATCHING_API}/journey/${journeyId}/find`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Confirm a match as a demander
  confirmMatchAsDemander: async (id: number, confirmed: boolean): Promise<Match> => {
    const response = await axios.put(
      `${MATCHING_API}/${id}/confirm/demander`,
      { confirmed } as MatchConfirmRequest,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Confirm a match as a traveler
  confirmMatchAsTraveler: async (id: number, confirmed: boolean): Promise<Match> => {
    const response = await axios.put(
      `${MATCHING_API}/${id}/confirm/traveler`,
      { confirmed } as MatchConfirmRequest,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Complete a match (admin only)
  completeMatch: async (id: number): Promise<Match> => {
    const response = await axios.put(`${MATCHING_API}/${id}/complete`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Cancel a match
  cancelMatch: async (id: number): Promise<Match> => {
    const response = await axios.put(`${MATCHING_API}/${id}/cancel`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default matchingApi; 