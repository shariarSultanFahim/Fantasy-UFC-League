import { RankingsDatabase } from "./components";

export default function RankingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <section className="mx-auto w-full max-w-6xl">
        <div className="rounded-lg bg-[#0E172B] px-6 py-12 text-center text-white sm:px-10 lg:py-14">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Fighters Directory</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore stats, records, and rankings of the world&apos;s elite mixed martial artists.
          </p>
        </div>

        <div className="mt-8">
          <RankingsDatabase />
        </div>
      </section>
    </main>
  );
}
