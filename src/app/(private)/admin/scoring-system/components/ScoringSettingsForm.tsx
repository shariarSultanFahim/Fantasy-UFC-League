"use client";

import {
  BadgePlus,
  BookCheck,
  Crown,
  Gauge,
  Handshake,
  Save,
  Scale,
  Shield,
  Sparkles,
  Swords,
  Undo2
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { SCORING_CRITERIA } from "@/constants/scoring-criteria";

import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/components/ui";
import type { ScoringSettings } from "@/types";

import { DEFAULT_SCORING_SETTINGS } from "../../../../../constants/scoring-settings";
import { scoringSettingsSchema } from "../schema/scoring-settings-schema";

const defaultValues: ScoringSettings = DEFAULT_SCORING_SETTINGS;

const scoringFields: Array<{
  name: keyof ScoringSettings;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
    ...SCORING_CRITERIA.map((criterion) => {
      const iconByCriteria: Record<
        keyof ScoringSettings,
        React.ComponentType<{ className?: string }>
      > = {
        winPoints: Shield,
        finishBonus: BadgePlus,
        winningChampionshipBout: Crown,
        championVsChampionWin: Crown,
        winningAgainstRankedOpponent: Gauge,
        winningFiveRoundFight: BookCheck
      };

      return {
        name: criterion.key,
        title: criterion.title,
        description: criterion.description,
        icon: iconByCriteria[criterion.key]
      };
    })
  ];

export function ScoringSettingsForm() {
  const form = useForm<ScoringSettings>({
    resolver: zodResolver(scoringSettingsSchema),
    defaultValues
  });

  const values = useWatch({
    control: form.control,
    defaultValue: defaultValues
  }) as ScoringSettings;

  const stoppageVictoryPreview = values.winPoints + values.finishBonus;
  const championVictoryPreview =
    values.winPoints + values.winningChampionshipBout + values.championVsChampionWin;
  const rankedFiveRoundWinPreview =
    values.winPoints + values.winningAgainstRankedOpponent + values.winningFiveRoundFight;

  const handleSubmit = (settings: ScoringSettings) => {
    console.log("scoringSettingsPayload:", settings);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {scoringFields.map((fieldItem) => {
              const Icon = fieldItem.icon;

              return (
                <Card key={fieldItem.name} className="gap-0 py-0">
                  <CardContent className="space-y-4 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                        <Icon className="size-4" />
                      </div>

                      <FormField
                        control={form.control}
                        name={fieldItem.name}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={20}
                                value={field.value}
                                className="h-10 text-center"
                                onChange={(event) => field.onChange(Number(event.target.value))}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <FormLabel className="text-base font-semibold text-slate-900">
                        {fieldItem.title}
                      </FormLabel>
                      <p className="text-sm leading-5 text-slate-600">{fieldItem.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="gap-0 bg-indigo-900 py-0 text-indigo-50">
            <CardContent className="space-y-4 px-4 py-4">
              <h3 className="text-xl font-semibold">Live Scoring Preview</h3>

              <div className="space-y-3 rounded-xl bg-indigo-800/70 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-indigo-200 uppercase">
                  Scenario: Stoppage Victory
                </p>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center justify-between">
                    <span>Win Point</span>
                    <span>+{values.winPoints}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Finish Bonus</span>
                    <span>+{values.finishBonus}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-indigo-700 pt-2 text-lg font-semibold">
                  <span>Total Fantasy Points</span>
                  <span>{stoppageVictoryPreview}</span>
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-indigo-800/70 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-indigo-200 uppercase">
                  Scenario: Champion vs Champion
                </p>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center justify-between">
                    <span>Base Win</span>
                    <span>+{values.winPoints}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Title Fight Bonus</span>
                    <span>+{values.winningChampionshipBout}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Champion vs Champion Bonus</span>
                    <span>+{values.championVsChampionWin}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-indigo-700 pt-2 text-lg font-semibold">
                  <span>Total Fantasy Points</span>
                  <span>{championVictoryPreview}</span>
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-indigo-800/70 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-indigo-200 uppercase">
                  Scenario: Ranked 5-Round Win
                </p>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center justify-between">
                    <span>Base Win</span>
                    <span>+{values.winPoints}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Ranked Opponent Bonus</span>
                    <span>+{values.winningAgainstRankedOpponent}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>5 Round Win Bonus</span>
                    <span>+{values.winningFiveRoundFight}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-indigo-700 pt-2 text-lg font-semibold">
                  <span>Total Fantasy Points</span>
                  <span>{rankedFiveRoundWinPreview}</span>
                </div>
              </div>

              <p className="text-xs text-indigo-200/90">
                Calculations update in real-time as you modify values.
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="gap-0 py-0">
          <CardContent className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">Review Changes</p>
              <p className="text-xs text-slate-600">
                Ensure all point values align with the league charter.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                <Undo2 className="size-4" />
                Reset to Default
              </Button>
              <Button type="submit">
                <Save className="size-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
