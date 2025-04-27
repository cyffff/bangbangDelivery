import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

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
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

interface JourneyState {
  journeys: Journey[];
  userJourneys: Journey[];
  currentJourney: Journey | null;
  loading: boolean;
  error: string | null;
}

const initialState: JourneyState = {
  journeys: [],
  userJourneys: [],
  currentJourney: null,
  loading: false,
  error: null,
};

// Create journey
export const createJourney = createAsyncThunk(
  'journey/create',
  async (journeyData: Omit<Journey, 'id' | 'userId' | 'status' | 'createdAt'>, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch('/api/journeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(journeyData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create journey');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Fetch user journeys
export const fetchUserJourneys = createAsyncThunk(
  'journey/fetchUserJourneys',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch('/api/journeys/user');
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch user journeys');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Fetch journey details
export const fetchJourneyDetails = createAsyncThunk(
  'journey/fetchDetails',
  async (journeyId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch(`/api/journeys/${journeyId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch journey details');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    clearCurrentJourney: (state) => {
      state.currentJourney = null;
    },
    setJourneyLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearJourneyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create journey
      .addCase(createJourney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJourney.fulfilled, (state, action) => {
        state.loading = false;
        state.userJourneys.push(action.payload);
        state.currentJourney = action.payload;
      })
      .addCase(createJourney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch user journeys
      .addCase(fetchUserJourneys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserJourneys.fulfilled, (state, action) => {
        state.loading = false;
        state.userJourneys = action.payload;
      })
      .addCase(fetchUserJourneys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch journey details
      .addCase(fetchJourneyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJourneyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJourney = action.payload;
      })
      .addCase(fetchJourneyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentJourney, setJourneyLoading, clearJourneyError } = journeySlice.actions;

// Selectors
export const selectJourneys = (state: RootState) => state.journey.journeys;
export const selectUserJourneys = (state: RootState) => state.journey.userJourneys;
export const selectCurrentJourney = (state: RootState) => state.journey.currentJourney;
export const selectJourneyLoading = (state: RootState) => state.journey.loading;
export const selectJourneyError = (state: RootState) => state.journey.error;

export default journeySlice.reducer; 