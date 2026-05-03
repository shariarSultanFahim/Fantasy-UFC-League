import { AdminPageHeader } from "../../components/AdminPageHeader";
import { FighterForm } from "../components/FighterForm";
import { getCountryNames } from "../components/fighters-data";

interface EditFighterPageProps {
  searchParams: Promise<{ fighterId?: string }>;
}

export default async function EditFighterPage({ searchParams }: EditFighterPageProps) {
  const { fighterId } = await searchParams;
  const nationalityOptions = await getCountryNames();

  return (
    <>
      <AdminPageHeader title="Edit Fighter" subtitle="Update fighter profile details and image" />
      <FighterForm
        mode="edit"
        id={fighterId}
        nationalityOptions={nationalityOptions}
      />
    </>
  );
}
