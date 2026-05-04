"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { post, get } from "@/lib/api";
import { ILegalDocument, ILegalResponse, ILegalListResponse, LegalDocumentType } from "@/types/legal";
import { IApiResponse } from "@/types/auth";

// ─── Legal Document Actions ───────────────────────────────────────────────────

/**
 * Fetches a specific legal document by its type.
 */
export function useLegalDocument(type: LegalDocumentType) {
  return useQuery({
    queryKey: ["legal", type],
    queryFn: () => get<ILegalResponse>(`/legal/${type}`),
  });
}

/**
 * Fetches all legal documents.
 */
export function useAllLegalDocuments() {
  return useQuery({
    queryKey: ["legal", "all"],
    queryFn: () => get<ILegalListResponse>("/legal"),
  });
}

/**
 * Creates or updates a legal document.
 */
export function useUpsertLegalDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { type: LegalDocumentType; content: string }) =>
      post<ILegalResponse, { type: LegalDocumentType; content: string }>("/legal", payload),
    onSuccess: (response) => {
      // Invalidate the specific document and the list
      queryClient.invalidateQueries({ queryKey: ["legal", response.data.type] });
      queryClient.invalidateQueries({ queryKey: ["legal", "all"] });
    },
  });
}
