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
  Undo2,
  Loader2
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";

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

import { useScoringSettings, useUpsertScoringSettings } from "@/lib/actions/scoring";
import { scoringSettingsSchema } from "../schema/scoring-settings-schema";

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
        winPoint: Shield,
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
  const { data: scoringData, isLoading } = useScoringSettings();
  const { mutate: upsertScoring, isPending: isSaving } = useUpsertScoringSettings();

  const form = useForm<ScoringSettings>({
    resolver: zodResolver(scoringSettingsSchema),
    defaultValues: {
      winPoint: 0,
      finishBonus: 0,
      winningChampionshipBout: 0,
      championVsChampionWin: 0,
      winningAgainstRankedOpponent: 0,
      winningFiveRoundFight: 0,
    }
  });

  useEffect(() => {
    if (scoringData?.data) {
      const { id, createdAt, updatedAt, ...settings } = scoringData.data;
      form.reset(settings);
    }
  }, [scoringData, form]);

  const values = useWatch({
    control: form.control,
  });

  const stoppageVictoryPreview = (values.winPoint || 0) + (values.finishBonus || 0);
  const championVictoryPreview =
    (values.winPoint || 0) + (values.winningChampionshipBout || 0) + (values.championVsChampionWin || 0);
  const rankedFiveRoundWinPreview =
    (values.winPoint || 0) + (values.winningAgainstRankedOpponent || 0) + (values.winningFiveRoundFight || 0);

  const handleSubmit = (settings: ScoringSettings) => {
    upsertScoring(settings, {
      onSuccess: () => {
        toast.success("Scoring settings updated successfully.");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to update scoring settings.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {scoringFields.map((fieldItem) => {
              const Icon = fieldItem.icon;

              return (
                <Card key={fieldItem.name} className="gap-0 py-0 overflow-hidden border-slate-100 bg-white shadow-sm transition-colors hover:border-indigo-200">
                  <CardContent className="space-y-4 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
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
                                {...field}
                                className="h-10 text-center border-slate-100 bg-slate-50 focus:border-indigo-300 focus:ring-0"
                                onChange={(event) => field.onChange(Number(event.target.value))}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <FormLabel className="text-base font-bold text-slate-900">
                        {fieldItem.title}
                      </FormLabel>
                      <p className="text-sm leading-5 text-slate-500">{fieldItem.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="gap-0 bg-indigo-900 py-0 text-indigo-50 border-none shadow-xl">
            <CardContent className="space-y-4 px-4 py-4">
              <h3 className="text-xl font-bold">Live Scoring Preview</h3>

              <div className="space-y-3 rounded-xl bg-indigo-800/70 p-4">
                <p className="text-xs font-bold tracking-[0.16em] text-indigo-200 uppercase">
                  Scenario: Stoppage Victory
                </p>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">Win Point</span>
                    <span className="font-bold">+{values.winPoint}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">Finish Bonus</span>
                    <span className="font-bold">+{values.finishBonus}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-indigo-700 pt-2 text-lg font-bold">
                  <span>Total Fantasy Points</span>
                  <span>{stoppageVictoryPreview}</span>
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-indigo-800/70 p-4">
                <p className="text-xs font-bold tracking-[0.16em] text-indigo-200 uppercase">
                  Scenario: Champion vs Champion
                </p>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">Base Win</span>
                    <span className="font-bold">+{values.winPoint}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">Title Fight Bonus</span>
                    <span className="font-bold">+{values.winningChampionshipBout}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">Champion vs Champion Bonus</span>
                    <span className="font-bold">+{values.championVsChampionWin}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-indigo-700 pt-2 text-lg font-bold">
                  <span>Total Fantasy Points</span>
                  <span>{championVictoryPreview}</span>
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-indigo-800/70 p-4">
                <p className="text-xs font-bold tracking-[0.16em] text-indigo-200 uppercase">
                  Scenario: Ranked 5-Round Win
                </p>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">Base Win</span>
                    <span className="font-bold">+{values.winPoint}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">Ranked Opponent Bonus</span>
                    <span className="font-bold">+{values.winningAgainstRankedOpponent}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-indigo-100">5 Round Win Bonus</span>
                    <span className="font-bold">+{values.winningFiveRoundFight}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-indigo-700 pt-2 text-lg font-bold">
                  <span>Total Fantasy Points</span>
                  <span>{rankedFiveRoundWinPreview}</span>
                </div>
              </div>

              <p className="text-xs text-indigo-200/90 text-center italic">
                Calculations update in real-time as you modify values.
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="gap-0 py-0 border-slate-100 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">Review Changes</p>
              <p className="text-xs text-slate-500">
                Ensure all point values align with the league charter.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
                className="rounded-full border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                <Undo2 className="mr-2 size-4" />
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="rounded-full bg-indigo-600 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
