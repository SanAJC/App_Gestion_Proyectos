// src/services/api.ts
import axios from "axios";
import { store } from "../store/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api", 
});

api.interceptors.request.use((config) => {
  // Intenta primero desde el store, si no hay, desde localStorage
  let token = store.getState().auth.token;
  if (!token) {
    token = localStorage.getItem("token");
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
