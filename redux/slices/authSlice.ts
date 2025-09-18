import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { AxiosError } from "axios";
import { UserTable } from "@/db/schema";

type User = Omit<UserTable, "password"> | null;

type AuthState = {
  user: User;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
}

// Async login thunk
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const user = await api.post<User>("/auth/login", credentials);
    console.log(user);
    return user.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ error?: string }>
    return thunkAPI.rejectWithValue(error?.response?.data?.error || 'Unexpected Error Occured');
  }
});

export const signup = createAsyncThunk<
  User,
  { firstName: string; lastName: string; username: string; email: string; password: string },
  { rejectValue: string }
>("auth/signup", async (credentials, thunkAPI) => {
  try {
    const user = await api.post<User>("/auth/signup", credentials);
    return user.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ error?: string }>
    return thunkAPI.rejectWithValue(error?.response?.data?.error || 'Unexpected Error Occured');
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_arg, thunkAPI) => {
  try {
    await api.post("/auth/logout", {});
  } catch (err: unknown) {
    const error = err as AxiosError<{ error?: string }>;
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Unexpected Error Occurred");
  }
});

export const updateUser = createAsyncThunk<
  void,
  { firstName: string; lastName: string; phoneNumber: string; avatar?: string | File | null },
  { rejectValue: string }
> ("auth/updateUser", async (credentials, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("firstName", credentials.firstName);
    formData.append("lastName", credentials.lastName);
    formData.append("phoneNumber", credentials.phoneNumber);
    if (credentials.avatar && typeof credentials.avatar != 'string') {
      formData.append("avatar", credentials.avatar);
    }

    await api.put("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err: unknown) {
    const error = err as AxiosError<{ error?: string }>
    return thunkAPI.rejectWithValue(error?.response?.data?.error || 'Unexpected Error Occured');
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
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
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Login failed"
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
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
