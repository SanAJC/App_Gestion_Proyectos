// src/services/api.ts
import axios from "axios";
import { store } from "../store/store";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Ajusto a la URL correcta según tu backend
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
