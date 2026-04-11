import Image from "next/image";

interface AuthSplitLayoutProps {
  heroBackgroundClassName: string;
  heroTitle: React.ReactNode;
  heroDescription: string;
  chips: string[];
  children: React.ReactNode;
}

export function AuthSplitLayout({
  heroBackgroundClassName,
  heroTitle,
  heroDescription,
  chips,
  children
}: AuthSplitLayoutProps) {
  return (
    <section className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside
          className={`relative hidden overflow-hidden border-r border-slate-200 lg:flex ${heroBackgroundClassName} bg-cover bg-center`}
        >
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-900/55 to-indigo-950/75" />
          <div className="relative z-10 flex w-full flex-col justify-between p-8 text-white xl:p-12">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Fantasy MMA" width={34} height={34} />
              <p className="text-2xl font-bold tracking-tight">Fantasy MMA</p>
            </div>

            <div className="max-w-xl space-y-5">
              <h1 className="text-6xl leading-[1.03] font-bold tracking-tight">{heroTitle}</h1>
              <p className="max-w-lg text-xl leading-8 text-white/90">{heroDescription}</p>

              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white/95 backdrop-blur"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-white/75">
              © 2026 Fantasy Fight League. All rights reserved.
            </p>
          </div>
        </aside>

        <main className="flex items-center justify-center p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </section>
  );
}
