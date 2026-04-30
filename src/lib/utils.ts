import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  return `${env.NEXT_PUBLIC_IMAGE_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
