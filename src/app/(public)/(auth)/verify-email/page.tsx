import { VerifyEmailForm } from "./components/VerifyEmailForm";
import { Suspense } from "react";

export const metadata = {
  title: "Verify Email | Fantasy UFC League",
  description: "Verify your email address to get started with Fantasy UFC League.",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
