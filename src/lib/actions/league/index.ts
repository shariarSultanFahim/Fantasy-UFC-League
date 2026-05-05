"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, del } from "@/lib/api";
import {
  ILeague,
  ILeagueListResponse,
  ILeagueResponse,
  IAddFighterPayload,
  IRemoveFighterPayload,
} from "@/types/league";
import { IFighterResponse, IFighterListResponse } from "@/types/fighter";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useLeagues(params: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
} = {}) {
  return useQuery({
    queryKey: ["leagues", params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const queryString = searchParams.toString();
      return get<ILeagueListResponse>(`/league${queryString ? `?${queryString}` : ""}`);
    },
  });
}

export function useMyLeagues() {
  return useQuery({
    queryKey: ["my-leagues"],
    queryFn: () => get<ILeagueListResponse>("/league/my/leagues"),
  });
}

export function useLeague(id: string) {
  return useQuery({
    queryKey: ["league", id],
    queryFn: () => get<ILeagueResponse>(`/league/${id}`),
    enabled: !!id,
  });
}

export function useAvailableFighters(id: string, params: {
  searchTerm?: string;
  divisionId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
} = {}) {
  return useQuery({
    queryKey: ["available-fighters", id, params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.divisionId) searchParams.append("divisionId", params.divisionId);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const queryString = searchParams.toString();
      return get<IFighterListResponse>(`/league/${id}/available-fighters${queryString ? `?${queryString}` : ""}`);
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => post<ILeagueResponse>("/league", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
    },
  });
}

export function useJoinLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { code: string; passcode?: string; teamName: string }) =>
      post<ILeagueResponse>("/league/join", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
    },
  });
}

export function useQuickJoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { teamName: string }) =>
      post<ILeagueResponse>("/league/join-quick", payload),
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
    mutationFn: (payload: IAddFighterPayload) =>
      post<any>(`/league/${leagueId}/add-fighter`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["league", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["available-fighters", leagueId] });
    },
  });
}

export function useRemoveFighter(leagueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IRemoveFighterPayload) =>
      post<any>(`/league/${leagueId}/remove-fighter`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["league", leagueId] });
      queryClient.invalidateQueries({ queryKey: ["available-fighters", leagueId] });
    },
  });
}
