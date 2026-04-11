import { AuthSplitLayout } from "../components/AuthSplitLayout";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthSplitLayout
      heroBackgroundClassName="bg-[url('/login.png')]"
      heroTitle={
        <>
          Build Your Ultimate
          <br />
          <span className="text-amber-400">Fantasy Fight Team</span>
        </>
      }
      heroDescription="Draft real fighters, compete with friends, and dominate the leaderboard with our industry-leading scoring engine."
      chips={["Live Fantasy Draft", "Real Fight Scoring", "Competitive Leagues"]}
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
