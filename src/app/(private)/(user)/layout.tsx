import Footer from "@/app/(public)/(home)/components/footer";
import Header from "@/app/(public)/(home)/components/header";
import { ReactNode } from "react";
import { withPrivateRoute } from "@/lib/hoc/with-route-guard";

function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <section className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1 pt-40 lg:pt-24">{children}</main>
            <Footer />
        </section>
    );
}

export default withPrivateRoute(HomeLayout, { allowedRoles: ["USER", "ADMIN"] });
