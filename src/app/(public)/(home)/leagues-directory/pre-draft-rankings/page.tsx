import { Suspense } from "react";

import { PreDraftRankingsBoard } from "./components/PreDraftRankingsBoard";

export default function PreDraftRankingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="mx-auto w-full max-w-7xl">
        <Suspense fallback={null}>
          <PreDraftRankingsBoard />
        </Suspense>
      </section>
    </main>
  );
}
