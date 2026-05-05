"use client";

import { get, post, patch, del } from "@/lib/api";
import { 
  Event, 
  ICreateEventPayload, 
  ICreateBoutPayload, 
  IPostBoutResultPayload 
} from "@/types/event";

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: T[];
  };
}

// ─── Event Actions ────────────────────────────────────────────────────────────

export const getEvents = async (params?: Record<string, any>) => {
  return get<IPaginatedResponse<Event>>("/event", { params });
};

export const getEventById = async (id: string) => {
  return get<IApiResponse<Event>>(`/event/${id}`);
};

export const createEvent = async (formData: FormData) => {
  return post<IApiResponse<Event>, FormData>("/event", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateEvent = async (id: string, formData: FormData) => {
  return patch<IApiResponse<Event>, FormData>(`/event/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteEvent = async (id: string) => {
  return del<IApiResponse<null>>(`/event/${id}`);
};

// ─── Bout Actions ─────────────────────────────────────────────────────────────

export const addBoutToEvent = async (payload: ICreateBoutPayload) => {
  return post<IApiResponse<any>, ICreateBoutPayload>("/event/bout", payload);
};

export const postBoutResult = async (boutId: string, payload: IPostBoutResultPayload) => {
  return patch<IApiResponse<any>, IPostBoutResultPayload>(`/event/bout/${boutId}/result`, payload);
};

export const deleteBout = async (boutId: string) => {
  return del<IApiResponse<null>>(`/event/bout/${boutId}`);
};
