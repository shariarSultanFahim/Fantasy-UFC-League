"use client";

import { useResetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: reset, isPending } = useResetPassword();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await reset({ token, password });
      toast.success("Password reset successful! You can now login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to reset password");
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below to reset your account access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11"
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="h-11 w-full text-sm font-semibold">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
