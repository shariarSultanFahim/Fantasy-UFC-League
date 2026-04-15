"use client";

import { Plus, Rocket, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { SCORING_CRITERIA } from "@/constants/scoring-criteria";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import type { Event, EventBoutFormValue } from "@/types";

import { FIGHTERS_DATA } from "../../fighters/components/fighters-data";
import { getEventFormSchema, type EventFormValues } from "../schema/event-form-schema";
import { EventCombobox } from "./EventCombobox";
import { EventPosterCropUploader } from "./EventPosterCropUploader";
import { WEIGHT_CLASS_OPTIONS } from "./events-data";

interface EventFormProps {
  mode: "create" | "edit";
  initialEvent?: Event;
}

const fighterOptions = FIGHTERS_DATA.map((fighter) => ({
  value: fighter.id,
  label: fighter.name
}));

const weightClassOptions = WEIGHT_CLASS_OPTIONS.map((weightClass) => ({
  value: weightClass,
  label: weightClass
}));

function getDefaultScoringCriteria(): EventBoutFormValue["scoringCriteria"] {
  return Object.fromEntries(
    SCORING_CRITERIA.map((criterion) => [criterion.key, false])
  ) as EventBoutFormValue["scoringCriteria"];
}

function emptyBout(): EventBoutFormValue {
  return {
    fighter1Id: "",
    fighter2Id: "",
    weightClass: "",
    rounds: 3,
    isMainEvent: false,
    isCoMainEvent: false,
    winnerId: "",
    scoringCriteria: getDefaultScoringCriteria()
  };
}

function toDefaultValues(initialEvent?: Event): EventFormValues {
  if (!initialEvent) {
    return {
      name: "",
      location: "",
      date: "",
      posterDataUrl: "",
      bouts: [emptyBout()]
    };
  }

  return {
    name: initialEvent.name,
    location: initialEvent.location,
    date: initialEvent.date,
    posterDataUrl: initialEvent.posterUrl,
    bouts: initialEvent.bouts.map((bout) => ({
      fighter1Id: bout.fighter1.id,
      fighter2Id: bout.fighter2.id,
      weightClass: bout.weightClass,
      rounds: bout.rounds,
      isMainEvent: bout.isMainEvent,
      isCoMainEvent: bout.isCoMainEvent,
      winnerId: bout.winnerId ?? "",
      scoringCriteria: bout.scoringCriteria ?? getDefaultScoringCriteria()
    }))
  };
}

export function EventForm({ mode, initialEvent }: EventFormProps) {
  const isEditMode = mode === "edit";

  const form = useForm<EventFormValues>({
    resolver: zodResolver(getEventFormSchema(mode)),
    defaultValues: toDefaultValues(initialEvent)
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bouts"
  });
  const watchedBouts = useWatch({
    control: form.control,
    name: "bouts"
  });

  const onSubmit = (values: EventFormValues) => {
    toast.success(
      mode === "create" ? "Event published successfully." : "Event result updated successfully.",
      {
        position: "top-center",
        description: `${values.bouts.length} bout${values.bouts.length === 1 ? "" : "s"} saved`
      }
    );
  };

  return (
    <Card className="py-0">
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl font-semibold">
          {isEditMode ? "Edit Event Results" : "Create / Edit UFC Event"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-6 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. UFC 306: Du Plessis vs Adesanya"
                        {...field}
                        disabled={isEditMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isEditMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Las Vegas, NV" {...field} disabled={isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <section className="space-y-4 rounded-xl border p-4 sm:p-5">
              <h3 className="text-base font-semibold">Fight Card / Matchups</h3>

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const fighterOneId = watchedBouts?.[index]?.fighter1Id ?? "";
                  const fighterTwoId = watchedBouts?.[index]?.fighter2Id ?? "";
                  const scoringCriteriaError =
                    (
                      form.formState.errors.bouts?.[index] as
                        | { scoringCriteria?: { message?: string } }
                        | undefined
                    )?.scoringCriteria?.message ?? "";

                  return (
                    <div key={field.id} className="space-y-4 rounded-lg border bg-muted/20 p-4">
                      {!isEditMode ? (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">Bout {index + 1}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            className="hover:bg-red-300"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <X className="size-4 text-red-500" />
                          </Button>
                        </div>
                      ) : null}

                      <div className="grid gap-4 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`bouts.${index}.fighter1Id`}
                          render={({ field: boutField }) => (
                            <FormItem>
                              <FormLabel>Fighter 1</FormLabel>
                              <FormControl>
                                <EventCombobox
                                  value={boutField.value}
                                  onValueChange={boutField.onChange}
                                  options={fighterOptions}
                                  placeholder="Search fighters..."
                                  searchPlaceholder="Search fighters..."
                                  disabled={isEditMode}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`bouts.${index}.fighter2Id`}
                          render={({ field: boutField }) => (
                            <FormItem>
                              <FormLabel>Fighter 2</FormLabel>
                              <FormControl>
                                <EventCombobox
                                  value={boutField.value}
                                  onValueChange={boutField.onChange}
                                  options={fighterOptions}
                                  placeholder="Search fighters..."
                                  searchPlaceholder="Search fighters..."
                                  disabled={isEditMode}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 lg:grid-cols-4">
                        <FormField
                          control={form.control}
                          name={`bouts.${index}.weightClass`}
                          render={({ field: boutField }) => (
                            <FormItem>
                              <FormLabel>Weight Class</FormLabel>
                              <FormControl>
                                <EventCombobox
                                  value={boutField.value}
                                  onValueChange={boutField.onChange}
                                  options={weightClassOptions}
                                  placeholder="Select weight class"
                                  searchPlaceholder="Search weight class..."
                                  disabled={isEditMode}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`bouts.${index}.rounds`}
                          render={({ field: boutField }) => (
                            <FormItem>
                              <FormLabel>Rounds</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={5}
                                  value={boutField.value}
                                  onChange={(event) =>
                                    boutField.onChange(Number(event.target.value))
                                  }
                                  disabled={isEditMode}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`bouts.${index}.isMainEvent`}
                          render={({ field: boutField }) => (
                            <FormItem className="self-end pb-2">
                              <label className="flex items-center gap-2 text-sm font-medium">
                                <Checkbox
                                  checked={boutField.value}
                                  onCheckedChange={(value) => boutField.onChange(Boolean(value))}
                                  disabled={isEditMode}
                                />
                                Set as Main Event
                              </label>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`bouts.${index}.isCoMainEvent`}
                          render={({ field: boutField }) => (
                            <FormItem className="self-end pb-2">
                              <label className="flex items-center gap-2 text-sm font-medium">
                                <Checkbox
                                  checked={boutField.value}
                                  onCheckedChange={(value) => boutField.onChange(Boolean(value))}
                                  disabled={isEditMode}
                                />
                                Set as Co-Main Event
                              </label>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {isEditMode ? (
                        <FormField
                          control={form.control}
                          name={`bouts.${index}.winnerId`}
                          render={({ field: boutField }) => (
                            <FormItem>
                              <FormLabel>Winner</FormLabel>
                              <FormControl>
                                <EventCombobox
                                  value={boutField.value}
                                  onValueChange={boutField.onChange}
                                  options={fighterOptions.filter(
                                    (fighter) =>
                                      fighter.value === fighterOneId ||
                                      fighter.value === fighterTwoId
                                  )}
                                  placeholder="Select winner"
                                  searchPlaceholder="Search winner..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : null}

                      {isEditMode ? (
                        <div className="space-y-3 rounded-lg bg-card p-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Scoring Criteria</p>
                            <p className="text-xs text-slate-600">
                              Toggle all criteria that should apply to this winner.
                            </p>
                          </div>

                          <div className="grid gap-2 space-y-2 lg:grid-cols-2">
                            {SCORING_CRITERIA.map((criterion) => (
                              <FormField
                                key={criterion.key}
                                control={form.control}
                                name={`bouts.${index}.scoringCriteria.${criterion.key}`}
                                render={({ field: criterionField }) => (
                                  <FormItem className="rounded-md border bg-muted/30 p-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <div>
                                        <FormLabel className="text-sm font-medium">
                                          {criterion.title}
                                        </FormLabel>
                                        <p className="text-xs text-slate-600">
                                          {criterion.description}
                                        </p>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={criterionField.value}
                                          onCheckedChange={(value) =>
                                            criterionField.onChange(Boolean(value))
                                          }
                                        />
                                      </FormControl>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>

                          {scoringCriteriaError ? (
                            <p className="text-sm text-destructive">{scoringCriteriaError}</p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {!isEditMode ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => append(emptyBout())}
                >
                  <Plus className="size-4" />
                  Add Another Bout
                </Button>
              ) : null}
            </section>

            <FormField
              control={form.control}
              name="posterDataUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EventPosterCropUploader
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="min-w-40">
                <Rocket className="size-4" />
                {isEditMode ? "Update Result" : "Publish Event"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
