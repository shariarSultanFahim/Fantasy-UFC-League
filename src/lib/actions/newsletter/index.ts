"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { post, get, patch, del } from "@/lib/api";
import { 
  INewsletterListResponse, 
  INewsletterResponse, 
  INewsletter 
} from "@/types/newsletter";

export function useNewsletters(params: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
} = {}) {
  return useQuery({
    queryKey: ["newsletters", params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const queryString = searchParams.toString();
      return get<INewsletterListResponse>(`/newsletter${queryString ? `?${queryString}` : ""}`);
    },
  });
}

export function useNewsletter(id: string) {
  return useQuery({
    queryKey: ["newsletter", id],
    queryFn: () => get<INewsletterResponse>(`/newsletter/${id}`),
    enabled: !!id,
  });
}

export function useCreateNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { data: { title: string; description: string }; image?: File }) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload.data));
      if (payload.image) formData.append("image", payload.image);
      return post<INewsletterResponse, FormData>("/newsletter", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
  });
}

export function useUpdateNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { data: Partial<{ title: string; description: string }>; image?: File } }) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload.data));
      if (payload.image) formData.append("image", payload.image);
      return patch<INewsletterResponse, FormData>(`/newsletter/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
      queryClient.invalidateQueries({ queryKey: ["newsletter", variables.id] });
    },
  });
}

export function useDeleteNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => del<INewsletterResponse>(`/newsletter/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
  });
}
