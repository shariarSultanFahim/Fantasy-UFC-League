import { AdminPageHeader } from "../../components/AdminPageHeader";
import { FighterForm } from "../components/FighterForm";
import { getCountryNames } from "../components/fighters-data";

export default async function NewFighterPage() {
  const nationalityOptions = await getCountryNames();

  return (
    <>
      <AdminPageHeader
        title="Add New Fighter"
        subtitle="Create a fighter profile with rank, records, and square avatar"
      />
      <FighterForm mode="create" nationalityOptions={nationalityOptions} />
    </>
  );
}
