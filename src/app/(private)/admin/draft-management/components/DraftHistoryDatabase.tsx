import { DRAFT_PICKS } from "./draft-data";
import { DraftHistoryTable } from "./DraftHistoryTable";

interface DraftHistoryDatabaseProps {
  leagueId?: string;
}

export function DraftHistoryDatabase({ leagueId }: DraftHistoryDatabaseProps) {
  const scopedPicks = leagueId
    ? DRAFT_PICKS.filter((pick) => pick.leagueId === leagueId)
    : DRAFT_PICKS;
  const recentPicks = scopedPicks.slice(0, 10);

  return (
    <section>
      <DraftHistoryTable picks={recentPicks} />
    </section>
  );
}
