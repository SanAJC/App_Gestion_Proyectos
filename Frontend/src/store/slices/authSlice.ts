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

// Función para intentar recuperar el usuario del localStorage
const getUserFromLocalStorage = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromLocalStorage(), // Intentar cargar del localStorage primero
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
      const userResponse = await api.get("/auth/profile");
      // Mapeo para asegurar que siempre haya username
      const userData = userResponse.data.user;
      const user = {
        uid: userData.uid,
        username: userData.username || userData.displayName || "",
        email: userData.email,
        rol: userData.rol,
      };
      localStorage.setItem("user", JSON.stringify(user));

      return {
        token: response.data.firebaseToken,
        githubToken: response.data.githubToken,
        user,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error al autenticar con GitHub"
      );
    }
  }
);

// Mejora en loadUserProfile para manejar errores adecuadamente
export const loadUserProfile = createAsyncThunk(
  "auth/loadUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      if (!state.auth.token) {
        throw new Error("No hay token disponible");
      }
      // Usar el endpoint correcto del backend
      const response = await api.get("/auth/profile");
      const userData = response.data.user;
      const user = {
        uid: userData.uid,
        username: userData.username || userData.displayName || "",
        email: userData.email,
        rol: userData.rol,
      };
      // Guardar en localStorage para persistencia
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      console.error("Error loading user profile:", error);
      // Si hay un error de autenticación (401), limpiar localStorage
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        // No eliminar tokens aquí para evitar bucles, eso se hace en logout
      }
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
      action: PayloadAction<{ token: string; githubToken: string; user?: User }>
    ) => {
      state.token = action.payload.token;
      state.githubToken = action.payload.githubToken;
      state.isAuthenticated = true;
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
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
          // Asegurar persistencia en localStorage
          localStorage.setItem("user", JSON.stringify(action.payload.user));
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

      // GitHub Callback
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

      // Load user profile - modificado para manejar mejor el estado
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          // Asegurar que se guarde en localStorage
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Solo limpiamos el usuario, no el token
        // para evitar bucles infinitos
      })

      // Logout - permanece igual
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.githubToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;
