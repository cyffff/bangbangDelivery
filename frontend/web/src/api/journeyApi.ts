import axios from 'axios';
import { 
  Journey, 
  JourneyCreateRequest, 
  JourneyUpdateRequest, 
  JourneyResponse, 
  JourneySearchParams 
} from '../types/Journey';

const API_URL = '/api/v1/journeys';

/**
 * Create a new journey
 */
export const createJourney = async (journeyData: JourneyCreateRequest): Promise<Journey> => {
  const response = await axios.post<Journey>(API_URL, journeyData);
  return response.data;
};

/**
 * Get journey by ID
 */
export const getJourneyById = async (id: string): Promise<Journey> => {
  const response = await axios.get<Journey>(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Update journey
 */
export const updateJourney = async (id: string, journeyData: JourneyUpdateRequest): Promise<Journey> => {
  const response = await axios.put<Journey>(`${API_URL}/${id}`, journeyData);
  return response.data;
};

/**
 * Delete journey
 */
export const deleteJourney = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

/**
 * List journeys with pagination and filtering
 */
export const searchJourneys = async (params: JourneySearchParams = {}): Promise<JourneyResponse> => {
  const response = await axios.get<JourneyResponse>(API_URL, { params });
  return response.data;
};

/**
 * Get all journeys by user ID
 */
export const getJourneysByUserId = async (userId: string): Promise<JourneyResponse> => {
  const response = await axios.get<JourneyResponse>(`${API_URL}/user/${userId}`);
  return response.data;
};

/**
 * Get popular journeys
 */
export const getPopularJourneys = async (limit: number = 10): Promise<Journey[]> => {
  const response = await axios.get<Journey[]>(`${API_URL}/popular`, { params: { limit } });
  return response.data;
};

/**
 * Cancel journey
 */
export const cancelJourney = async (id: string): Promise<Journey> => {
  const response = await axios.post<Journey>(`${API_URL}/${id}/cancel`);
  return response.data;
};

/**
 * Complete journey
 */
export const completeJourney = async (id: string): Promise<Journey> => {
  const response = await axios.post<Journey>(`${API_URL}/${id}/complete`);
  return response.data;
};

/**
 * Get matching demands for a journey
 */
export const getMatchingDemandsForJourney = async (journeyId: string): Promise<any[]> => {
  const response = await axios.get<any[]>(`/api/v1/matching/journeys/${journeyId}/demands`);
  return response.data;
};

// Export all functions as a single object for compatibility
export const journeyApi = {
  createJourney,
  getJourneyById,
  updateJourney,
  deleteJourney,
  searchJourneys,
  getJourneysByUserId,
  getPopularJourneys,
  cancelJourney,
  completeJourney,
  getMatchingDemandsForJourney
};

export default journeyApi; 