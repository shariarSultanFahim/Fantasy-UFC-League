import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | Fantasy UFC League",
  description: "Reset your password for Fantasy UFC League.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <ForgotPasswordForm />
    </div>
  );
}
