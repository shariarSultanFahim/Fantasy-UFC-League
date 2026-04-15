import { DraftManagementView } from "./components/DraftManagementView";

interface DraftManagementPageProps {
  searchParams: Promise<{ leagueId?: string; teamId?: string }>;
}

export default async function DraftManagementPage({ searchParams }: DraftManagementPageProps) {
  const { leagueId, teamId } = await searchParams;

  return <DraftManagementView leagueId={leagueId} teamId={teamId} />;
}
