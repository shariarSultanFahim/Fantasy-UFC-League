"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues
} from "../schema/reset-password-form-schema";

const defaultValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: ""
};

export function ResetPasswordForm() {
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues
  });

  const onSubmit = (_values: ResetPasswordFormValues) => {
    router.push("/login");
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white py-0 shadow-xl shadow-slate-900/15">
      <CardHeader className="space-y-2 px-6 pt-7 sm:px-8">
        <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">
          Create New Password
        </CardTitle>
        <p className="text-sm text-slate-600">
          Enter and confirm your new password to regain access to your account.
        </p>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-7 sm:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Min. 8 characters" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Re-enter password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-11 w-full text-sm font-semibold">
              Reset Password
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600">
            Back to Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
