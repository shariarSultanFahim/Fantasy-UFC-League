import { AuthSplitLayout } from "../components/AuthSplitLayout";
import { ForgetPasswordForm } from "./components/ForgetPasswordForm";

export default function ForgetPasswordPage() {
  return (
    <AuthSplitLayout
      heroBackgroundClassName="bg-[url('/forget-password.png')]"
      heroTitle={
        <>
          Reset Your
          <br />
          <span className="text-amber-400">Account Access</span>
        </>
      }
      heroDescription="Enter your email to receive a password reset link and regain access to your fantasy fight account."
      chips={["Secure Recovery", "Fast Account Access", "Always Protected"]}
    >
      <ForgetPasswordForm />
    </AuthSplitLayout>
  );
}
