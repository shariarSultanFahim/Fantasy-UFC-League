"use client";
import Cookies from "js-cookie";

export const cookie = {
  get: (key: string) => typeof window !== "undefined" ? (Cookies.get(key) ?? null) : null,
  set: (key: string, value: string, days = 365) => {
    if (typeof window === "undefined") return;
    Cookies.set(key, value, {
      expires: days,
      sameSite: "Lax",
      path: "/",
      secure: process.env.NODE_ENV === "production"
    });
  },
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    Cookies.remove(key);
  }
};
