"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { post, get } from "@/lib/api";
import { ISystemScoringResponse, ISystemScoringSetting } from "@/types/scoring";

export function useScoringSettings() {
  return useQuery({
    queryKey: ["scoring", "settings"],
    queryFn: () => get<ISystemScoringResponse>("/system-score"),
  });
}

export function useUpsertScoringSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ISystemScoringSetting>) =>
      post<ISystemScoringResponse, any>("/system-score/upsert", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scoring", "settings"] });
    },
  });
}
