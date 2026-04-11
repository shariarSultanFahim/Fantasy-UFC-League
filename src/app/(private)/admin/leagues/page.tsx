import { AdminPageHeader } from "../components/AdminPageHeader";
import { LeaguesDatabase } from "./components/LeaguesDatabase";

export default function LeaguesPage() {
  return (
    <>
      <AdminPageHeader
        title="League Management"
        subtitle="Manage all active and upcoming leagues"
      />
      <LeaguesDatabase />
    </>
  );
}
