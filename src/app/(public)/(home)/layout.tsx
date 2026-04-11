import { ReactNode } from "react";

import Footer from "./components/footer";
import Header from "./components/header";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 pt-40 lg:pt-24">{children}</main>
      <Footer />
    </section>
  );
}
