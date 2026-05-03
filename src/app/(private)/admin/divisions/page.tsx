import { AdminPageHeader } from "../components/AdminPageHeader";
import { DivisionDatabase } from "./components/DivisionDatabase";

export const metadata = {
  title: "Weight Divisions | Admin Dashboard",
  description: "Manage UFC weight divisions and roster categories",
};

export default function DivisionsPage() {
  return (
    <>
      <AdminPageHeader
        title="Weight Divisions"
        subtitle="Organize fighters into weight categories and manage roster segments"
      />
      <DivisionDatabase />
    </>
  );
}
