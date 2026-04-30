import { AuthSplitLayout } from "../components/AuthSplitLayout";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password | Fantasy UFC League",
  description: "Set a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      heroBackgroundClassName="bg-[url('/forget-password.png')]"
      heroTitle={
        <>
          Reset Your
          <br />
          <span className="text-amber-400">Password</span>
        </>
      }
      heroDescription="Enter your new password to regain access to your fantasy fight account."
      chips={["Secure Recovery", "Fast Account Access", "Always Protected"]}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
