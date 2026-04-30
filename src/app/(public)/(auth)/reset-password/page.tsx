import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password | Fantasy UFC League",
  description: "Set a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
