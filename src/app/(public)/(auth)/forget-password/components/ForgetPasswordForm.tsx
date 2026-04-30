"use client";

import { useState } from "react";
import Link from "next/link";

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
  forgetPasswordFormSchema,
  type ForgetPasswordFormValues
} from "../schema/forget-password-form-schema";
import { toast } from "sonner";
import { useForgotPassword } from "@/lib/actions/auth";

const defaultValues: ForgetPasswordFormValues = {
  email: ""
};

export function ForgetPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const form = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordFormSchema),
    defaultValues
  });

  const onSubmit = async (values: ForgetPasswordFormValues) => {
    if (!values.email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await forgotPassword({ email: values.email });
      setSubmittedEmail(values.email);
      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    }
    form.reset(defaultValues);
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white py-0 shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2 px-6 pt-7 sm:px-8">
        <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">
          Forgot Password
        </CardTitle>
        <p className="text-sm text-slate-600">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-7 sm:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="name@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-11 w-full text-sm font-semibold">
              Confirm
            </Button>
          </form>
        </Form>

        <div className="space-y-4 text-center text-sm">
          {submittedEmail ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
              Email sent to {submittedEmail}. Check your inbox to continue.
            </p>
          ) : null}
          <Link href="/login" className="font-medium text-slate-700 hover:text-indigo-700">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
