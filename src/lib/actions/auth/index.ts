"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { post, get, patch, api } from "@/lib/api";
import { IApiResponse, ILoginResponse, User } from "@/types/auth";

// ─── Registration & Verification ───────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: { data: any; image?: File }) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload.data));
      if (payload.image) formData.append("image", payload.image);
      return post<IApiResponse<User>, FormData>("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      post<IApiResponse<{ accessToken: string; refreshToken: string }>, any>("/auth/verify-email", payload),
  });
}

export function useResendOTP() {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      post<IApiResponse<null>, any>("/auth/resend-otp", payload),
  });
}

// ─── Login ────────────────────────────────────────────────────────────────────

export function useLogin() {
  return useMutation({
    mutationFn: (payload: any) =>
      post<IApiResponse<ILoginResponse>, any>("/auth/login", payload),
  });
}

// ─── Password Management ───────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      post<IApiResponse<null>, any>("/auth/forget-password", payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { token: string; password: string }) =>
      post<IApiResponse<null>, any>("/auth/reset-password", { password: payload.password }, {
        headers: { Authorization: `Bearer ${payload.token}` },
      }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: any) =>
      post<IApiResponse<null>, any>("/auth/change-password", payload),
  });
}

// ─── Profile Management ─────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => get<IApiResponse<User>>("/auth/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { data: any; image?: File }) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload.data));
      if (payload.image) formData.append("image", payload.image);
      return patch<IApiResponse<User>, FormData>("/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.clear();
    // Cookie removal should be handled by the caller or a central logout helper
  };
}
