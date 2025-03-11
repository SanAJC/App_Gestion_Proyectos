// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  GitHubLoginResponse,
  User,
} from "../../types/auth";
import { RootState } from "../store";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  githubToken: localStorage.getItem("githubToken"),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      localStorage.setItem("token", response.data.data.idToken);

      // Obtener información del usuario
      const userInfo: User = {
        uid: response.data.data.localId,
        username: response.data.data.displayName || "",
        email: response.data.data.email,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));

      return {
        token: response.data.data.idToken,
        user: userInfo,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<RegisterResponse>(
        "/auth/register",
        credentials
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  }
);

export const checkGithubCallback = createAsyncThunk(
  "auth/githubCallback",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await api.get<GitHubLoginResponse>(
        `/auth/github/callback?code=${code}`
      );

      localStorage.setItem("token", response.data.firebaseToken);
      localStorage.setItem("githubToken", response.data.githubToken);

      // Obtener información del usuario después de la autenticación con GitHub
      const userResponse = await api.get("/user/profile");
      localStorage.setItem("user", JSON.stringify(userResponse.data.user));

      return {
        token: response.data.firebaseToken,
        githubToken: response.data.githubToken,
        user: userResponse.data.user,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error al autenticar con GitHub"
      );
    }
  }
);

// Crea una nueva acción thunk para cargar el perfil después de establecer los tokens
export const loadUserProfile = createAsyncThunk(
  "auth/loadUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: RootState = getState() as RootState;
      if (!state.auth.token) {
        throw new Error("No hay token disponible");
      }

      const response = await api.get("/user/profile");
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cargar el perfil del usuario"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("githubToken");
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Añade este nuevo reducer
    setTokens: (
      state,
      action: PayloadAction<{ token: string; githubToken: string }>
    ) => {
      state.token = action.payload.token;
      state.githubToken = action.payload.githubToken;
      state.isAuthenticated = true;
      // Falta cargar los datos del usuario, que deberías hacer en una acción separada
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GitHub Auth
      .addCase(checkGithubCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        checkGithubCallback.fulfilled,
        (
          state,
          action: PayloadAction<{
            token: string;
            githubToken: string;
            user: User;
          }>
        ) => {
          state.loading = false;
          state.token = action.payload.token;
          state.githubToken = action.payload.githubToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(checkGithubCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loadUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.githubToken = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// export const { clearError } = authSlice.actions;
export default authSlice.reducer;
// Exporta la nueva acción
export const { clearError, setTokens } = authSlice.actions;
