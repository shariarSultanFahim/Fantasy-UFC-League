"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, del } from "@/lib/api";
import { toast } from "sonner";
import {
  ILeague,
  ILeagueListResponse,
  ILeagueResponse,
  IAvailableLeagueListResponse,
  IJoinLeaguePayload,
  ICreateLeaguePayload,
  IAvailableFightersResponse,
} from "@/types/league";

export interface IAdminLeagueParams {
  searchTerm?: string;
  status?: string;
  leagueType?: string;
  managerId?: string;
  isSystemGenerated?: boolean | string;
  code?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useAvailableLeagues(params: {
  searchTerm?: string;
  leagueType?: 'PUBLIC' | 'PRIVATE';
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["available-leagues", params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.leagueType) searchParams.append("leagueType", params.leagueType);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());

      const queryString = searchParams.toString();
      return get<IAvailableLeagueListResponse>(`/league/available${queryString ? `?${queryString}` : ""}`);
    },
  });
}

export function useMyLeagues() {
  return useQuery({
    queryKey: ["my-leagues"],
    queryFn: () => get<ILeagueListResponse>("/league/my/leagues"),
  });
}

export function useAdminLeagues(params: IAdminLeagueParams = {}) {
  return useQuery({
    queryKey: ["admin-leagues", params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.status && params.status !== "all") searchParams.append("status", params.status);
      if (params.leagueType) searchParams.append("leagueType", params.leagueType);
      if (params.managerId) searchParams.append("managerId", params.managerId);
      if (params.isSystemGenerated !== undefined) searchParams.append("isSystemGenerated", params.isSystemGenerated.toString());
      if (params.code) searchParams.append("code", params.code);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const queryString = searchParams.toString();
      // Use any for response type temporarily to handle top-level meta vs nested meta differences safely.
      return get<any>(`/league/admin/all${queryString ? `?${queryString}` : ""}`);
    },
  });
}

export function useLeague(id: string) {
  return useQuery({
    queryKey: ["league", id],
    queryFn: () => get<ILeagueResponse>(`/league/${id}`),
    enabled: !!id,
  });
}

export function useAvailableFighters(leagueId: string, params: {
  searchTerm?: string;
  divisionId?: string;
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["available-fighters", leagueId, params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      searchParams.append("leagueId", leagueId);
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.divisionId) searchParams.append("divisionId", params.divisionId);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      
      // Using /fighter endpoint as specified in fighter.md, but conceptually for this league
      const queryString = searchParams.toString();
      return get<IAvailableFightersResponse>(`/fighter${queryString ? `?${queryString}` : ""}`);
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateLeaguePayload) => post<ILeagueResponse>("/league", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
    },
  });
}

export function useJoinLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IJoinLeaguePayload) =>
      post<ILeagueResponse>("/league/join", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
    },
  });
}

export function useUpdateLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      patch<ILeagueResponse>(`/league/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
      queryClient.invalidateQueries({ queryKey: ["league", variables.id] });
    },
  });
}

export function useDeleteLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => del<ILeagueResponse>(`/league/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
    },
  });
}

export function useAddFighter(leagueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { fighterId: string }) =>
      post<any>(`/league/${leagueId}/add-fighter`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["league", leagueId] });
    },
  });
}

export function useRemoveFighter(leagueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { fighterId: string }) =>
      post<any>(`/league/${leagueId}/remove-fighter`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["league", leagueId] });
    },
  });
}

export function useProposeTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      leagueId: string;
      targetTeamId: string;
      offeredFighterIds: string[];
      requestedFighterIds: string[];
    }) => post<any>("/trade/propose", payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["league", variables.leagueId] });
      toast.success("Trade offer sent successfully!", { position: "top-center" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to propose trade", { position: "top-center" });
    },
  });
}

export function useQuickJoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { teamName: string }) => post<ILeagueResponse>("/league/quick-join", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
    },
  });
}
export function useLeaveLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => post<any>(`/league/${id}/leave`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
    },
  });
}
