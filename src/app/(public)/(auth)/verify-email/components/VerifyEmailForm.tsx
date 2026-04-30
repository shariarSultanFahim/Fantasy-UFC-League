"use client";

import { useVerifyEmail, useResendOTP } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cookie } from "@/lib/cookie-client";
import { AUTH_SESSION_COOKIE, ROLE_HOME_PATHS } from "@/constants/auth";
import { buildAuthSessionFromLoginResponse } from "@/lib/auth/session";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const { mutateAsync: verify, isPending } = useVerifyEmail();
  const { mutateAsync: resend, isPending: isResending } = useResendOTP();

  useEffect(() => {
    if (!email) {
      toast.error("Email is required for verification");
      router.push("/sign-up");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await verify({ email, otp });
      if (response.success) {
        // Auto-login after verification
        const data = response.data as any;
        const session = buildAuthSessionFromLoginResponse({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user || { role: "USER" } // Fallback role if not in token/response
        });
        cookie.set(AUTH_SESSION_COOKIE, JSON.stringify(session));
        
        toast.success(response.message || "Email verified and logged in!");
        router.push(ROLE_HOME_PATHS[session.role]);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await resend({ email });
      toast.success("OTP resent to your email");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to resend OTP");
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">Verify Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit verification code to <span className="font-semibold text-slate-900">{email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <Label htmlFor="otp" className="sr-only">Verification Code</Label>
            <div className="flex justify-center gap-2">
              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="h-14 text-center text-2xl font-bold tracking-[0.5em]"
                autoFocus
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Enter the 6-digit code from your email.
            </p>
          </div>

          <Button type="submit" disabled={isPending} className="h-11 w-full text-sm font-semibold">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          <div className="text-center text-sm">
            <p className="text-slate-600">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-semibold text-orange-500 hover:text-orange-600 disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
