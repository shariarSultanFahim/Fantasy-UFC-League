import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, del } from "@/lib/api";
import { IFighter, IFighterFilters, IPaginatedResponse } from "@/types";
import { toast } from "sonner";

export const FIGHTERS_QUERY_KEY = ["fighters"];

export function useFighters(filters?: IFighterFilters) {
  return useQuery({
    queryKey: [FIGHTERS_QUERY_KEY, filters],
    queryFn: () => {
      const params: any = {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        searchTerm: filters?.searchTerm || undefined,
        divisionId: filters?.divisionId || undefined,
        isActive: filters?.isActive,
        nationality: filters?.nationality || undefined,
      };

      // Handle rank range logic
      if (filters?.rankRange) {
        if (filters.rankRange === "Top 5") {
          params.minRank = 1;
          params.maxRank = 5;
        } else if (filters.rankRange === "Top 10") {
          params.minRank = 1;
          params.maxRank = 10;
        } else if (filters.rankRange === "Top 15") {
          params.minRank = 1;
          params.maxRank = 15;
        } else if (filters.rankRange === "Unranked") {
          // Typically backend might handle this via a specific flag or minRank null
          // Adjust based on backend implementation if needed
        }
      }

      return get<IPaginatedResponse<IFighter>>("/fighter", { params });
    },
  });
}

export function useFighter(id: string | null) {
  return useQuery({
    queryKey: [FIGHTERS_QUERY_KEY, id],
    queryFn: () => (id ? get<{ success: boolean; data: IFighter }>(`/fighter/${id}`) : null),
    enabled: !!id,
  });
}

export function useCreateFighter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      post<{ success: boolean; message: string }>("/fighter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Fighter created successfully");
        queryClient.invalidateQueries({ queryKey: [FIGHTERS_QUERY_KEY] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create fighter");
    },
  });
}

export function useUpdateFighter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      patch<{ success: boolean; message: string }>(`/fighter/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (res, { id }) => {
      if (res.success) {
        toast.success(res.message || "Fighter updated successfully");
        queryClient.invalidateQueries({ queryKey: [FIGHTERS_QUERY_KEY, id] });
        queryClient.invalidateQueries({ queryKey: [FIGHTERS_QUERY_KEY] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update fighter");
    },
  });
}

export function useDeleteFighter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => del<{ success: boolean; message: string }>(`/fighter/${id}`),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Fighter deleted successfully");
        queryClient.invalidateQueries({ queryKey: [FIGHTERS_QUERY_KEY] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete fighter");
    },
  });
}
