import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_GA_ID: z.string().optional(),
    NEXT_PUBLIC_IMAGE_BASE_URL: z.string()
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL
  }
});
