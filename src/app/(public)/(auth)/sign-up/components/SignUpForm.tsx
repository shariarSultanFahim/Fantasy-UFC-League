"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegister } from "@/lib/actions/auth";

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

import { signUpFormSchema, type SignUpFormValues } from "../schema/sign-up-form-schema";

const defaultValues: SignUpFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false
};

export function SignUpForm() {
  const router = useRouter();
  const { mutateAsync: register, isPending } = useRegister();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      const response = await register({
        data: {
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
          phone: values.phone
        }
      });
      
      toast.success(response.message);
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Registration failed");
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white py-0 shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2 px-6 pt-7 sm:px-8">
        <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">
          Create Your Account
        </CardTitle>
        <p className="text-sm text-slate-600">Start building your fantasy fight team today.</p>
      </CardHeader>

      <CardContent className="px-6 pb-7 sm:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="TheChamp123" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1234567890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="fighter@example.com" />
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
                    <Input type="password" {...field} placeholder="Minimum 8 characters" />
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Re-enter password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      />
                    </FormControl>
                    <FormLabel className="text-sm leading-6 font-normal text-slate-600">
                      I agree to the
                      <p>
                        <a href="/terms" className="underline underline-offset-2">
                          Terms of Service
                        </a>
                      </p>
                      and
                      <p>
                        <a href="/terms" className="underline underline-offset-2">
                          Privacy Policy
                        </a>
                      </p>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="h-11 w-full text-sm font-semibold">
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
