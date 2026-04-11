import { AuthSplitLayout } from "../components/AuthSplitLayout";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      heroBackgroundClassName="bg-[url('/new-password.png')]"
      heroTitle={
        <>
          Set Your
          <br />
          <span className="text-amber-400">New Password</span>
        </>
      }
      heroDescription="Use a strong password with letters and numbers to keep your fantasy MMA account secure."
      chips={["Secure Reset", "Instant Access Recovery", "Protected Account"]}
    >
      <ResetPasswordForm />
    </AuthSplitLayout>
  );
}
