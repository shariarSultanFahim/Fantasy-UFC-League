import { AuthRole } from "@/types/auth";

export const AUTH_SESSION_COOKIE = "ufc_league_session";
export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";
export const UNAUTHORIZED_PATH = "/";

export const ROLE_HOME_PATHS: Record<AuthRole, string> = {
  ADMIN: "/admin",
  USER: "/leagues-directory",
};
