import { ReactNode } from "react";
import { AuthRole } from "@/types/auth";
import { redirectIfAuthenticated, requirePrivateRole } from "@/lib/auth/route-guard";

type LayoutProps = { children: ReactNode };
type LayoutComponent = (props: LayoutProps) => ReactNode | Promise<ReactNode>;

/** Wraps a private layout. Redirects to login if unauthenticated or wrong role. */
export const withPrivateRoute = (
  Layout: LayoutComponent,
  options: { allowedRoles: AuthRole[] }
) => {
  return async function GuardedLayout(props: LayoutProps) {
    await requirePrivateRole(options.allowedRoles);
    return <Layout {...props} />;
  };
};

/** Wraps a public/auth layout. Redirects to home if the user is already logged in. */
export const withPublicRoute = (Layout: LayoutComponent) => {
  return async function GuardedLayout(props: LayoutProps) {
    await redirectIfAuthenticated();
    return <Layout {...props} />;
  };
};
