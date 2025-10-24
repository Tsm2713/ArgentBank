import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$|^\/+/, '') || 'http://localhost:3001/api/v1';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.body.token;
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { getState }) => {
  const token = getState().auth.token;
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Profile fetch failed');
  return data.body;
});

export const updateUserName = createAsyncThunk('auth/update', async (newUserName, { getState }) => {
  const token = getState().auth.token;
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName: newUserName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data.body;
});

const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    signOut: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserName.pending, (state) => { state.loading = true; })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) state.user.userName = action.payload.userName;
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, signOut } = authSlice.actions;
export default authSlice.reducer;
