// src/types/auth.ts
export interface User {
  uid?: string;
  username: string;
  email: string;
  rol?: string;
  displayName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  githubToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  rol?: string;
}

export interface LoginResponse {
  message: string;
  data: {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    displayName?: string;
  };
}

export interface RegisterResponse {
  message: string;
  uid: string;
}

export interface GitHubLoginResponse {
  message: string;
  firebaseToken: string;
  githubToken: string;
}
