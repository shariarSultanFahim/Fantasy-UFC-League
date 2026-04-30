"use client";

import { useForgotPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await forgotPassword({ email });
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl shadow-slate-900/10 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a password reset link to <span className="font-semibold text-slate-900">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">
            If you don&apos;t see it, check your spam folder or try again.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
            Try another email
          </Button>
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-orange-500 hover:text-orange-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="h-11"
            />
          </div>

          <Button type="submit" disabled={isPending} className="h-11 w-full text-sm font-semibold">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
