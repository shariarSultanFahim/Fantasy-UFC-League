import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import type { ReactNode } from "react";

import { seoConfig } from "@/config/seo";

import { Providers } from "@/providers";
import "@/styles/globals.css";
import { Toaster } from "@/ui";

const fontSans = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
export const metadata: Metadata = seoConfig;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable}  flex min-h-screen w-full flex-col antialiased`}
      >
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
