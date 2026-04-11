import { DRAFT_PICKS } from "./draft-data";
import { DraftHistoryTable } from "./DraftHistoryTable";

export function DraftHistoryDatabase() {
  const recentPicks = DRAFT_PICKS.slice(0, 10);

  return (
    <section>
      <DraftHistoryTable picks={recentPicks} />
    </section>
  );
}
