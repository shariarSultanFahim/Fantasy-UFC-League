"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Copy, Share2, Trophy } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  joinLeagueLobby,
  setLeagueDraftStatus,
  upsertLeagueLobbyMeta
} from "@/helpers/league-lobby";

import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  createLeagueFormSchema,
  LEAGUE_SIZE_OPTIONS,
  PICK_TIME_LIMIT_OPTIONS,
  type CreateLeagueFormValues
} from "../schema/create-league-form-schema";

const INVITE_CODE = "MMA2026";

const defaultValues: CreateLeagueFormValues = {
  leagueName: "",
  leagueSize: "10",
  leagueType: "public",
  draftType: "snake",
  draftDate: "",
  draftTime: "",
  pickTimeLimit: "60",
  passcode: ""
};

function toLeagueSlug(leagueName: string) {
  return leagueName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateLeagueForm() {
  const router = useRouter();
  const form = useForm<CreateLeagueFormValues>({
    resolver: zodResolver(createLeagueFormSchema),
    defaultValues
  });

  const leagueName = useWatch({ control: form.control, name: "leagueName" });
  const leagueType = useWatch({ control: form.control, name: "leagueType" });

  const shareLink = useMemo(() => {
    const slug = toLeagueSlug(leagueName);
    const leaguePath = slug ? `/leagues-directory/${slug}` : "/leagues-directory";

    return `https://fantasymma.app${leaguePath}?invite=${INVITE_CODE}`;
  }, [leagueName]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join my Fantasy MMA league",
        text: "Use this link to join my league.",
        url: shareLink
      });
      return;
    }

    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  const onSubmit = (values: CreateLeagueFormValues) => {
    const leagueId = toLeagueSlug(values.leagueName) || `league-${Date.now()}`;

    upsertLeagueLobbyMeta({
      id: leagueId,
      name: values.leagueName,
      memberLimit: Number(values.leagueSize)
    });
    setLeagueDraftStatus(leagueId, "waiting");
    joinLeagueLobby(leagueId);

    const payload = {
      ...values,
      leagueId,
      inviteCode: INVITE_CODE,
      shareLink
    };

    void payload;
    router.push(`/leagues-directory/draft-lobby?leagueId=${leagueId}`);
  };

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-[#0E2A57] sm:text-5xl">
            Create Your Fantasy MMA League
          </h1>
          <p className="max-w-2xl text-base text-slate-500">
            Start a new league, invite friends, and draft your favorite fighters to compete for the
            ultimate championship.
          </p>
        </div>
        <div className="hidden rounded-full border border-amber-500 p-4 text-amber-600 shadow-sm sm:block">
          <Trophy className="size-7" />
        </div>
      </header>

      <Card className="rounded-2xl border border-slate-200 bg-slate-100 p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-3xl font-semibold text-[#0E2A57]">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#0E2A57] text-sm text-white">
                  1
                </span>
                League Info
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="leagueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>League Name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="e.g. Octagon Warriors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leagueSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>League Size</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEAGUE_SIZE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option} Participants
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leagueType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>League Type</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 rounded-md border border-slate-200 bg-white p-1">
                          <Button
                            type="button"
                            variant={field.value === "public" ? "default" : "ghost"}
                            className="h-8"
                            onClick={() => field.onChange("public")}
                            aria-pressed={field.value === "public"}
                          >
                            Public
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "private" ? "default" : "ghost"}
                            className="h-8"
                            onClick={() => field.onChange("private")}
                            aria-pressed={field.value === "private"}
                          >
                            Private
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-6">
              <h2 className="flex items-center gap-2 text-3xl font-semibold text-[#0E2A57]">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#0E2A57] text-sm text-white">
                  2
                </span>
                Draft Settings
              </h2>

              <div className="grid gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="draftType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Draft Type</FormLabel>
                      <FormControl>
                        <>
                          <input type="hidden" name={field.name} value="snake" />
                          <Input className="bg-white" value="Snake Draft" readOnly />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="draftDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Draft Date</FormLabel>
                      <FormControl>
                        <Input className="bg-white" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="draftTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Draft Time</FormLabel>
                      <FormControl>
                        <Input className="bg-white" type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickTimeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pick Time Limit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select timer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PICK_TIME_LIMIT_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}s
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {leagueType === "private" ? (
                <FormField
                  control={form.control}
                  name="passcode"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel>League Passcode</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Set private passcode"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <div className="grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-[160px_1fr_auto_auto] md:items-end">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Invite Code</p>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold tracking-[0.2em] text-[#0E2A57] uppercase">
                    {INVITE_CODE}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Share Link</p>
                  <Input
                    className="bg-white"
                    readOnly
                    value={shareLink}
                    aria-label="League share link"
                  />
                </div>

                <Button type="button" variant="outline" onClick={handleCopyLink}>
                  <Copy />
                  Copy Link
                </Button>

                <Button type="button" variant="outline" onClick={handleShareLink}>
                  <Share2 />
                  Share Link
                </Button>
              </div>
            </section>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
              <Button type="button" variant="ghost" asChild>
                <Link href="/leagues-directory">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-[#0E2A57] hover:bg-[#12336b]">
                Create League
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </section>
  );
}
