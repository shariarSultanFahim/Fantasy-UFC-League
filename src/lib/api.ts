import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { AUTH_SESSION_COOKIE, LOGIN_PATH } from "@/constants/auth";
import { env } from "@/env";
import { parseAuthSession } from "@/lib/auth/session";
import Cookies from "js-cookie";

// ─── Axios instance ────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { Accept: "application/json" },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Request interceptor: attach access token ─────────────────────────────────
api.interceptors.request.use(async (config) => {
  const rawSession = Cookies.get(AUTH_SESSION_COOKIE);
  if (rawSession) {
    const session = parseAuthSession(rawSession);
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`; // Updated to use Bearer prefix
    }
  }
  return config;
});

// ─── Response interceptor: handle token refresh ────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const rawSession = Cookies.get(AUTH_SESSION_COOKIE);
      if (!rawSession) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      const session = parseAuthSession(rawSession);
      if (!session) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });

        if (data.success) {
          const newSession = {
            ...session,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          };
          
          Cookies.set(AUTH_SESSION_COOKIE, JSON.stringify(newSession), {
            expires: 365,
            sameSite: "Lax",
            path: "/",
            secure: process.env.NODE_ENV === "production"
          });

          const bearerToken = `Bearer ${data.data.accessToken}`;
          originalRequest.headers.Authorization = bearerToken;
          processQueue(null, bearerToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        Cookies.remove(AUTH_SESSION_COOKIE);
        if (typeof window !== "undefined") {
          window.location.href = LOGIN_PATH;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (axios.isAxiosError(error)) return Promise.reject(error);
    return Promise.reject(new AxiosError("Unknown error"));
  }
);

// ─── Convenience wrappers ─────────────────────────────────────────────────────
type Cfg = AxiosRequestConfig & { signal?: AbortSignal };

export const get = async <T>(url: string, config?: Cfg) =>
  (await api.get<T>(url, config)).data;

export const post = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.post<T>(url, body, config)).data;

export const put = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.put<T>(url, body, config)).data;

export const patch = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.patch<T>(url, body, config)).data;

export const del = async <T>(url: string, config?: Cfg) =>
  (await api.delete<T>(url, config)).data;
