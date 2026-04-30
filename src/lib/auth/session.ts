import { AuthRole, AuthSession, ILoginResponse } from "@/types/auth";

const normalizeAuthRole = (role: string | null | undefined): AuthRole | null => {
  const n = role?.toUpperCase();
  return n === "ADMIN" || n === "USER" ? (n as AuthRole) : null;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  try {
    if (typeof window !== "undefined") {
      const decoded = atob(padded);
      return JSON.parse(decoded);
    } else {
      const decoded = Buffer.from(padded, "base64").toString("utf8");
      return JSON.parse(decoded);
    }
  } catch {
    return null;
  }
};

const extractRoleFromToken = (token: string): AuthRole | null => {
  const payload = decodeJwtPayload(token);
  return normalizeAuthRole(payload?.role as string);
};

export const parseAuthSession = (raw: string): AuthSession | null => {
  const tryParse = (input: string): AuthSession | null => {
    try {
      const parsed = JSON.parse(input) as Partial<AuthSession>;
      if (!parsed.accessToken || !parsed.refreshToken) return null;
      const role = normalizeAuthRole(parsed.role) ?? extractRoleFromToken(parsed.accessToken);
      if (!role) return null;
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        role: role as AuthRole,
      };
    } catch {
      return null;
    }
  };
  return tryParse(raw) ?? tryParse(decodeURIComponent(raw));
};

export const buildAuthSessionFromLoginResponse = (data: ILoginResponse): AuthSession => {
  const { accessToken, refreshToken, user } = data;
  if (!accessToken || !refreshToken) {
    throw new Error("Authentication failed: Missing tokens.");
  }
  const role = normalizeAuthRole(user?.role) ?? extractRoleFromToken(accessToken);
  if (!role) throw new Error("Unable to detect user role.");
  return { accessToken, refreshToken, role };
};
