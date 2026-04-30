import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthRole } from "@/types/auth";
import { AUTH_SESSION_COOKIE, LOGIN_PATH, ROLE_HOME_PATHS, UNAUTHORIZED_PATH } from "@/constants/auth";
import { parseAuthSession } from "@/lib/auth/session";

export const getSessionFromRequest = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  return raw ? parseAuthSession(raw) : null;
};

export const requirePrivateRole = async (allowedRoles: AuthRole[]) => {
  const session = await getSessionFromRequest();

  if (!session) {
    redirect(LOGIN_PATH);
  }

  if (!allowedRoles.includes(session.role)) {
    redirect(UNAUTHORIZED_PATH);
  }

  return session;
};

export const redirectIfAuthenticated = async () => {
  const session = await getSessionFromRequest();
  if (session) {
    redirect(ROLE_HOME_PATHS[session.role]);
  }
};
