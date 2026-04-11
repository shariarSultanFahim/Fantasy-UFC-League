import { AdminPageHeader } from "../components/AdminPageHeader";
import { ScoringSettingsForm } from "./components/ScoringSettingsForm";

export default function ScoringSystemPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Scoring System"
        subtitle="Configure point rules and scoring multipliers"
      />
      <ScoringSettingsForm />
    </section>
  );
}
