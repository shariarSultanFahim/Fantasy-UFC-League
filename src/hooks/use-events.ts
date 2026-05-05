"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  addBoutToEvent,
  postBoutResult,
  deleteBout
} from "@/lib/actions/event";
import { ICreateBoutPayload, IPostBoutResultPayload } from "@/types/event";

export function useEvents(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => getEvents(params),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateEvent(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useAddBout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBoutToEvent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["event", variables.eventId] });
    },
  });
}

export function usePostBoutResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boutId, payload }: { boutId: string; payload: IPostBoutResultPayload }) => 
      postBoutResult(boutId, payload),
    onSuccess: () => {
      // We might need to invalidate events or the specific event if we know the eventId
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}

export function useDeleteBout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}
