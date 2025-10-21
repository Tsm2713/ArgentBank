import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../api/client';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await request('/user/login', {
        method: 'POST',
        body: { email, password },
      });
      return data.body.token;
    } catch (err) {
      return rejectWithValue(err.payload || { message: err.message, status: err.status });
    }
  }
);

export const fetchProfile = createAsyncThunk('auth/profile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error('Missing token');
      const data = await request('/user/profile', {
        method: 'GET',
        token,
      });
      return data.body;
    } catch (err) {
      return rejectWithValue(err.payload || { message: err.message, status: err.status });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload && action.payload.message) || 'Login failed';
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload && action.payload.message) || 'Unable to load profile';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
