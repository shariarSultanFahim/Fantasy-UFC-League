import { env } from "@/env";
import type { SiteConfig } from "@/types/site-config";

export const siteConfig: SiteConfig = {
  name: "Fantasy MMA League",
  description: "A fantasy sports league for MMA fans to create their own teams and compete against others.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "Fantasy MMA League Team",
  locale: "en",
  themeColor: "#576045",
  keywords: ["fantasy sports", "MMA", "MMA", "sports league", "team management"],
  social: {
    twitter: "",
    github: "",
    linkedin: ""
  },
  ogImage: "/og.jpg"
} as const;
