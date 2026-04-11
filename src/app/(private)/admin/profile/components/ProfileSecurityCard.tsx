import { BellRing, KeyRound, LockKeyhole, Save, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const accountControls = [
  {
    title: "Two-factor authentication",
    description: "Require a verification step when signing in from a new device.",
    checked: true
  },
  {
    title: "Email alerts",
    description: "Receive messages for security events and critical admin updates.",
    checked: true
  }
];

export function ProfileSecurityCard() {
  return (
    <Card className="border-border/60 bg-card/95 py-0 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-linear-to-r from-slate-50 to-blue-50/70 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-950">
              <LockKeyhole className="size-5 text-blue-700" aria-hidden="true" />
              Account Security
            </CardTitle>
            <CardDescription className="max-w-xl text-sm text-slate-600">
              Update your password, review verification settings, and control how the admin account
              receives alerts.
            </CardDescription>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Secured
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-5 py-6 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="current-password"
                className="h-11 pl-10"
                placeholder="Enter current password"
                type="password"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Sparkles className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="new-password"
                className="h-11 pl-10"
                placeholder="Enter a stronger password"
                type="password"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          {accountControls.map((control) => (
            <div
              key={control.title}
              className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  {control.title === "Email alerts" ? (
                    <BellRing className="size-4 text-blue-700" aria-hidden="true" />
                  ) : (
                    <ShieldCheck className="size-4 text-blue-700" aria-hidden="true" />
                  )}
                  <p className="text-sm font-semibold text-slate-950">{control.title}</p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">{control.description}</p>
              </div>

              <Switch aria-label={control.title} defaultChecked={control.checked} />
            </div>
          ))}
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Last password change
            </p>
            <p className="text-sm font-semibold text-slate-950">18 days ago</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Recovery email
            </p>
            <p className="text-sm font-semibold text-slate-950">Connected</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Active devices
            </p>
            <p className="text-sm font-semibold text-slate-950">3 trusted devices</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border/60 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
        <Button className="w-full sm:w-auto" variant="outline" type="button">
          Cancel
        </Button>
        <Button className="w-full shadow-lg shadow-blue-950/15 sm:w-auto" type="button">
          <Save className="size-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
