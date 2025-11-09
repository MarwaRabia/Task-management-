/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/auth/authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../services/api";
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../../types/user.types";
import axios from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {

  token: localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  loading: false,
  error: null,
};

// Login Async Thunk
export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const serverData = response.data.data;
      if (!serverData || !serverData.token) {
        return rejectWithValue("Invalid server response structure.");
      }
     
      const user: User = {
        id: String(serverData.id),
        name: serverData.fullName, 
        email: serverData.email,
        role: String(serverData.role),
        profileImage:serverData.profileImage

      };
      const finalPayload: LoginResponse = {
        token: serverData.token,
        user: user,
      };
      return finalPayload;

      // return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
      }
      return rejectWithValue("Unexpected error");
    }
  }
);



export const register = createAsyncThunk<LoginResponse, RegisterRequest>(
  "auth/register", 
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", credentials);
      const serverData = response.data.data;
      if (!serverData || !serverData.token) {
        return rejectWithValue("Invalid server response structure.");
      }
      
      const user: User = {
        id: String(serverData.id),
        name: serverData.fullName,
        email: serverData.email,
        role: String(serverData.role),

      };
      const finalPayload: LoginResponse = {
        token: serverData.token,
        user: user,
      };
      return finalPayload;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Registration failed"
        );
      }
      return rejectWithValue("Unexpected error");
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },

    initializeAuth: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.token = token;
      }
    },

    setUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      } as User;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, initializeAuth, setUser } =
  authSlice.actions;
export default authSlice.reducer;
