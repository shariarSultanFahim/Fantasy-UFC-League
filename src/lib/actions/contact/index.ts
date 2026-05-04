"use client";

import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/api";
import { IContactPayload, IContactResponse } from "@/types/contact";

export function useSendMessage() {
  return useMutation({
    mutationFn: (payload: IContactPayload) => {
      return post<IContactResponse, IContactPayload>("/contact", payload);
    },
  });
}
