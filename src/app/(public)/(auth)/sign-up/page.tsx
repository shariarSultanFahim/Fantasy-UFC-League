import { AuthSplitLayout } from "../components/AuthSplitLayout";
import { SignUpForm } from "./components/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthSplitLayout
      heroBackgroundClassName="bg-[url('/sign-up.png')]"
      heroTitle={
        <>
          Create Your
          <br />
          <span className="text-amber-400">Fantasy Fight Team</span>
        </>
      }
      heroDescription="Join leagues, draft fighters, and compete with friends using real-time fight results from the world's premier MMA organizations."
      chips={["Live Fantasy Draft", "Fighter Stats & Rankings", "Competitive Leagues"]}
    >
      <SignUpForm />
    </AuthSplitLayout>
  );
}
