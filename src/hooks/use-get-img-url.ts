"use client";

import { getImageUrl } from "@/lib/utils";
import { useMemo } from "react";

export function useGetImgUrl(path?: string | null) {
  return useMemo(() => getImageUrl(path), [path]);
}
