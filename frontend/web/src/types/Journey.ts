export interface Journey {
  id: string;
  userId: string;
  departureCountry: string;
  departureCity: string;
  destinationCountry: string;
  destinationCity: string;
  departureDate: string;
  arrivalDate: string;
  availableWeightKg: number;
  preferredItemTypes: string[];
  notes?: string;
  status: JourneyStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    profileImageUrl?: string;
    creditScore: number;
  };
}

export enum JourneyStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ONGOING = 'ongoing'
}

export interface JourneyCreateRequest {
  departureCountry: string;
  departureCity: string;
  destinationCountry: string;
  destinationCity: string;
  departureDate: string;
  arrivalDate: string;
  availableWeightKg: number;
  preferredItemTypes: string[];
  notes?: string;
}

export interface JourneyUpdateRequest extends JourneyCreateRequest {
  status?: JourneyStatus;
}

export interface JourneySearchParams {
  departureCountry?: string;
  departureCity?: string;
  destinationCountry?: string;
  destinationCity?: string;
  departureDate?: string;
  arrivalDate?: string;
  minAvailableWeightKg?: number;
  maxAvailableWeightKg?: number;
  preferredItemTypes?: string[];
  status?: JourneyStatus;
  userId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface JourneyResponse {
  content: Journey[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface JourneyMatch {
  journeyId: string;
  demandId: string;
  matchScore: number;
  journey: Journey;
  demand?: any;  // We can import Demand type if needed
} 