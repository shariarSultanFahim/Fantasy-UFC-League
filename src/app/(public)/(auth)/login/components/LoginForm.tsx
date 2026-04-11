"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { loginFormSchema, type LoginFormValues } from "../schema/login-form-schema";

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false
};

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues
  });

  const onSubmit = (_values: LoginFormValues) => {
    router.push("/admin/dashboard");
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white py-0 shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2 px-6 pt-7 sm:px-8">
        <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">
          Welcome Back
        </CardTitle>
        <p className="text-sm text-slate-600">Login to manage your fantasy team.</p>
      </CardHeader>

      <CardContent className="px-6 pb-7 sm:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="fighter@octagon.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        />
                      </FormControl>
                      <FormLabel className="text-sm leading-none font-normal text-slate-600">
                        Remember Me
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Link
                href="/forget-password"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="h-11 w-full text-sm font-semibold">
              Login
            </Button>

            <p className="text-center text-sm text-slate-600">
              New to the platform?{" "}
              <Link href="/sign-up" className="font-semibold text-slate-900 hover:text-indigo-700">
                Create an Account
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
