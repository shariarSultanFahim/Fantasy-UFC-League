import {
  articleCards,
  BottomCallToAction,
  BuildTeamCard,
  NewsCard,
  RankingsCard,
  StandingsCard
} from "./components";

export default function HomePage() {
  return (
    <main className="bg-slate-100 text-slate-900">
      <section className="px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.65fr_0.9fr]">
          <div className="space-y-4">
            {articleCards.map((article) => (
              <NewsCard key={article.title} {...article} />
            ))}
          </div>

          <aside className="space-y-4">
            <StandingsCard />
            <BuildTeamCard />
            <RankingsCard />
          </aside>
        </div>
      </section>

      <BottomCallToAction />
    </main>
  );
}
