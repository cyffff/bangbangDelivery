import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { demandApi, CreateDemandRequest, UpdateDemandRequest } from '../../api/demandApi';

export interface DeliveryDemand {
  id: string;
  userId: string;
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
  rewardAmount?: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface DemandState {
  demands: DeliveryDemand[];
  currentDemand: DeliveryDemand | null;
  loading: boolean;
  error: string | null;
  filter: 'ALL' | 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
}

// Mock data for development only
const mockDemands: DeliveryDemand[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Electronics from New York to Dubai',
    description: 'Small electronics that need to be delivered',
    itemType: 'ELECTRONICS',
    weightKg: 1.5,
    estimatedValue: 500,
    originCountry: 'USA',
    originCity: 'New York',
    destinationCountry: 'UAE',
    destinationCity: 'Dubai',
    deadline: '2023-12-25',
    rewardAmount: 50,
    status: 'PENDING',
    createdAt: '2023-10-15T14:30:00Z',
    updatedAt: '2023-10-15T14:30:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Documents from Beijing to London',
    description: 'Important business documents',
    itemType: 'DOCUMENT',
    weightKg: 0.5,
    originCountry: 'China',
    originCity: 'Beijing',
    destinationCountry: 'UK',
    destinationCity: 'London',
    deadline: '2023-11-20',
    rewardAmount: 30,
    status: 'IN_TRANSIT',
    createdAt: '2023-10-14T09:15:00Z',
    updatedAt: '2023-10-14T10:30:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Traditional medicine from Shanghai to Paris',
    description: 'Traditional Chinese medicine items',
    itemType: 'MEDICINE',
    weightKg: 2.0,
    estimatedValue: 200,
    originCountry: 'China',
    originCity: 'Shanghai',
    destinationCountry: 'France',
    destinationCity: 'Paris',
    deadline: '2023-12-01',
    rewardAmount: 40,
    status: 'DELIVERED',
    createdAt: '2023-10-13T13:00:00Z',
    updatedAt: '2023-10-13T15:45:00Z'
  }
];

const initialState: DemandState = {
  demands: mockDemands, // In production, this would be an empty array
  currentDemand: null,
  loading: false,
  error: null,
  filter: 'ALL'
};

// Async thunks
export const fetchAllDemands = createAsyncThunk(
  'demand/fetchAllDemands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await demandApi.getAllDemands();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch demands');
    }
  }
);

export const fetchUserDemands = createAsyncThunk(
  'demand/fetchUserDemands',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await demandApi.getUserDemands(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user demands');
    }
  }
);

export const fetchDemandById = createAsyncThunk(
  'demand/fetchDemandById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await demandApi.getDemandById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch demand details');
    }
  }
);

export const createDemand = createAsyncThunk(
  'demand/createDemand',
  async (demand: CreateDemandRequest, { rejectWithValue }) => {
    try {
      const response = await demandApi.createDemand(demand);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create demand');
    }
  }
);

export const updateDemand = createAsyncThunk(
  'demand/updateDemand',
  async ({ id, demand }: { id: string; demand: UpdateDemandRequest }, { rejectWithValue }) => {
    try {
      const response = await demandApi.updateDemand(id, demand);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update demand');
    }
  }
);

export const cancelDemand = createAsyncThunk(
  'demand/cancelDemand',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await demandApi.cancelDemand(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel demand');
    }
  }
);

export const deleteDemand = createAsyncThunk(
  'demand/deleteDemand',
  async (id: string, { rejectWithValue }) => {
    try {
      await demandApi.deleteDemand(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete demand');
    }
  }
);

export const searchDemands = createAsyncThunk(
  'demand/searchDemands',
  async (searchParams: Parameters<typeof demandApi.searchDemands>[0], { rejectWithValue }) => {
    try {
      const response = await demandApi.searchDemands(searchParams);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search demands');
    }
  }
);

const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {
    setCurrentDemand: (state, action: PayloadAction<string>) => {
      state.currentDemand = state.demands.find(demand => demand.id === action.payload) || null;
    },
    clearCurrentDemand: (state) => {
      state.currentDemand = null;
    },
    setFilter: (state, action: PayloadAction<DemandState['filter']>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAllDemands
      .addCase(fetchAllDemands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDemands.fulfilled, (state, action) => {
        state.loading = false;
        state.demands = action.payload;
      })
      .addCase(fetchAllDemands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchUserDemands
      .addCase(fetchUserDemands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDemands.fulfilled, (state, action) => {
        state.loading = false;
        state.demands = action.payload;
      })
      .addCase(fetchUserDemands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchDemandById
      .addCase(fetchDemandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDemandById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDemand = action.payload;
      })
      .addCase(fetchDemandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createDemand
      .addCase(createDemand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDemand.fulfilled, (state, action) => {
        state.loading = false;
        state.demands.unshift(action.payload);
        state.currentDemand = action.payload;
      })
      .addCase(createDemand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateDemand
      .addCase(updateDemand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDemand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.demands.findIndex(demand => demand.id === action.payload.id);
        if (index !== -1) {
          state.demands[index] = action.payload;
        }
        if (state.currentDemand && state.currentDemand.id === action.payload.id) {
          state.currentDemand = action.payload;
        }
      })
      .addCase(updateDemand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // cancelDemand
      .addCase(cancelDemand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelDemand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.demands.findIndex(demand => demand.id === action.payload.id);
        if (index !== -1) {
          state.demands[index] = action.payload;
        }
        if (state.currentDemand && state.currentDemand.id === action.payload.id) {
          state.currentDemand = action.payload;
        }
      })
      .addCase(cancelDemand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // deleteDemand
      .addCase(deleteDemand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDemand.fulfilled, (state, action) => {
        state.loading = false;
        state.demands = state.demands.filter(demand => demand.id !== action.payload);
        if (state.currentDemand && state.currentDemand.id === action.payload) {
          state.currentDemand = null;
        }
      })
      .addCase(deleteDemand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // searchDemands
      .addCase(searchDemands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDemands.fulfilled, (state, action) => {
        state.loading = false;
        state.demands = action.payload;
      })
      .addCase(searchDemands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentDemand, clearCurrentDemand, setFilter, clearError } = demandSlice.actions;

// Selectors
export const selectAllDemands = (state: RootState) => state.demand.demands;
export const selectFilteredDemands = (state: RootState) => {
  const filter = state.demand.filter;
  return filter === 'ALL' 
    ? state.demand.demands 
    : state.demand.demands.filter(demand => demand.status === filter);
};
export const selectCurrentDemand = (state: RootState) => state.demand.currentDemand;
export const selectDemandLoading = (state: RootState) => state.demand.loading;
export const selectDemandError = (state: RootState) => state.demand.error;
export const selectDemandFilter = (state: RootState) => state.demand.filter;

export default demandSlice.reducer; 