import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

type AuthState = {
  user: { email: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
}

// Async login thunk
export const loginUser = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    await api.post("/auth/login", credentials)
  } catch {
    return thunkAPI.rejectWithValue("Network error")
  }
});

export const updateUser = createAsyncThunk<
  void,
  { firstName: string; lastName: string; phoneNumber: string; },
  { rejectValue: string }
> ("auth/updateUser", async (credentials, thunkAPI) => {
  try {
    await api.put("/users/me", credentials)
  } catch {
    return thunkAPI.rejectWithValue("Network error")
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed"
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed"
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
