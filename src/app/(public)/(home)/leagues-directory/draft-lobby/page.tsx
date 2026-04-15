import { Suspense } from "react";

import { DraftLobbyBoard } from "./components/DraftLobbyBoard";

export default function DraftLobbyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="mx-auto w-full max-w-6xl">
        <Suspense fallback={null}>
          <DraftLobbyBoard />
        </Suspense>
      </section>
    </main>
  );
}
