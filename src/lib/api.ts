import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
});

const TOKEN_KEY = "orbit_token";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage puede fallar en modo privado; la sesion simplemente
    // no persistira entre recargas, pero la app sigue funcionando.
  }
}

// Adjunta el token JWT (si existe) a cada peticion saliente.
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiErrorShape {
  success: false;
  message: string;
}

/// Extrae un mensaje de error legible de una respuesta axios/API.
export function extractErrorMessage(error: unknown, fallback = "Ocurrio un error inesperado"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
