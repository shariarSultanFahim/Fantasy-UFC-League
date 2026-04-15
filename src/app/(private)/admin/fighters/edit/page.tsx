import { AdminPageHeader } from "../../components/AdminPageHeader";
import { FighterForm } from "../components/FighterForm";
import { getFighterById } from "../components/fighters-data";

interface EditFighterPageProps {
  searchParams: Promise<{ fighterId?: string }>;
}

export default async function EditFighterPage({ searchParams }: EditFighterPageProps) {
  const { fighterId } = await searchParams;
  const fighter = getFighterById(fighterId);

  return (
    <>
      <AdminPageHeader title="Edit Fighter" subtitle="Update fighter profile details and image" />
      <FighterForm
        mode="edit"
        initialValues={{
          name: fighter.name,
          nickname: fighter.nickname,
          nationality: fighter.nationality,
          division: fighter.division,
          rank: fighter.rank ?? 15,
          wins: fighter.wins,
          losses: fighter.losses,
          draws: fighter.draws,
          avgPoints: fighter.points,
          bio: `${fighter.name} (${fighter.nickname}) is one of the most recognized names in ${fighter.division}.`,
          avatarDataUrl: fighter.avatarUrl
        }}
      />
    </>
  );
}
