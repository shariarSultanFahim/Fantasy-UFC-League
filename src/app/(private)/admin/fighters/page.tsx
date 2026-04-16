import { AdminPageHeader } from "../components/AdminPageHeader";

import { FightersDatabase } from "./components/FightersDatabase";

export default function FightersPage() {
  return (
    <>
      <AdminPageHeader
        title="Fighter Database"
        subtitle="Manage and scout active MMA roster for your leagues"
        actionLabel="Add New Fighter"
        actionHref="/admin/fighters/new"
      />
      <FightersDatabase />
    </>
  );
}