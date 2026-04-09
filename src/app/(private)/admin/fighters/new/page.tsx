import { AdminPageHeader } from "../../components/AdminPageHeader";

import { FighterForm } from "../components/FighterForm";

export default function NewFighterPage() {
  return (
    <>
      <AdminPageHeader
        title="Add New Fighter"
        subtitle="Create a fighter profile with rank, records, and square avatar"
      />
      <FighterForm mode="create" />
    </>
  );
}