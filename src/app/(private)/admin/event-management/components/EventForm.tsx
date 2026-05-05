"use client";

import * as React from "react";
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

import { useFighters } from "@/hooks/use-fighters";
import { useDivisions } from "@/hooks/use-divisions";
import { useScoringSettings } from "@/lib/actions/scoring";
import { useCreateEvent, useUpdateEvent, usePostBoutResult, useEvent } from "@/hooks/use-events";
import { getEventFormSchema, type EventFormValues } from "../schema/event-form-schema";
import { EventCombobox } from "./EventCombobox";
import { EventPosterCropUploader } from "./EventPosterCropUploader";
import { ICreateEventPayload, IPostBoutResultPayload } from "@/types/event";

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",");
  if (arr.length < 2) return null;
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) return null;
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

interface EventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  initialEvent?: Event;
}


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

  // Robust date parsing for the <input type="date" /> which expects YYYY-MM-DD
  let formattedDate = "";
  if (initialEvent.date) {
    try {
      const dateObj = new Date(initialEvent.date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split("T")[0];
      } else {
        // Fallback for non-ISO strings
        formattedDate = initialEvent.date.split("T")[0];
      }
    } catch {
      formattedDate = String(initialEvent.date).split("T")[0];
    }
  }

  return {
    name: initialEvent.name || "",
    location: initialEvent.location || "",
    date: formattedDate,
    posterDataUrl: initialEvent.posterUrl || "",
    bouts: (initialEvent.bouts || []).filter(Boolean).map((bout: any) => {
      // Handle both fighter1/2 and boutFighters structures
      const f1 = bout.fighter1 || bout.boutFighters?.[0]?.fighter;
      const f2 = bout.fighter2 || bout.boutFighters?.[1]?.fighter;

      return {
        id: bout.id,
        fighter1Id: f1?.id ? String(f1.id) : "",
        fighter2Id: f2?.id ? String(f2.id) : "",
        weightClass: bout.weightClass || "",
        rounds: bout.rounds || 3,
        isMainEvent: bout.isMainEvent || false,
        isCoMainEvent: bout.isCoMainEvent || false,
        winnerId: bout.winnerId ? String(bout.winnerId) : (bout.outcome?.winnerId ? String(bout.outcome.winnerId) : ""),
        scoringCriteria: bout.outcome ? (
          Object.fromEntries(
            SCORING_CRITERIA.map((criterion) => [
              criterion.key,
              Boolean(bout.outcome?.[criterion.key as keyof typeof bout.outcome])
            ])
          ) as EventBoutFormValue["scoringCriteria"]
        ) : getDefaultScoringCriteria()
      };
    })
  };
}

export function EventForm({ mode, eventId, initialEvent }: EventFormProps) {
  const isEditMode = mode === "edit";
  const { data: eventData, isLoading: isEventLoading } = useEvent(eventId || "");

  const { data: fightersData } = useFighters({ limit: 1000 });
  const { divisions } = useDivisions({ limit: 100 });
  const { data: scoringData } = useScoringSettings();

  const scoringSettings = scoringData?.data;

  const fighterOptions = React.useMemo(() => {
    const optionsMap = new Map<string, string>();

    // 1. Add current fighters from bouts (initial load or fetched data) 
    // to ensure they show up even if not in the first page of API results
    const bouts = eventData?.data?.bouts || initialEvent?.bouts;
    if (bouts) {
      bouts.forEach((bout: any) => {
        const f1 = bout.fighter1 || bout.boutFighters?.[0]?.fighter;
        const f2 = bout.fighter2 || bout.boutFighters?.[1]?.fighter;
        
        if (f1) {
          optionsMap.set(String(f1.id), f1.name);
        }
        if (f2) {
          optionsMap.set(String(f2.id), f2.name);
        }
      });
    }

    // 2. Add fighters from API
    fightersData?.data?.data?.forEach((fighter: any) => {
      optionsMap.set(String(fighter.id), fighter.name);
    });

    return Array.from(optionsMap.entries()).map(([value, label]) => ({
      label,
      value
    }));
  }, [fightersData, eventData, initialEvent]);

  const weightClassOptions = React.useMemo(
    () =>
      divisions?.map((division) => ({
        value: division.name,
        label: division.name
      })) ?? [],
    [divisions]
  );

  const currentEvent = eventData?.data || initialEvent;
  const status = currentEvent?.status;
  const isUpcoming = status === "UPCOMING";
  const isOngoing = status === "ONGOING";
  const isCompleted = status === "COMPLETED";

  const schema = React.useMemo(() => getEventFormSchema(mode, status), [mode, status]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaultValues(initialEvent)
  });

  React.useEffect(() => {
    if (eventData?.data && mode === "edit") {
      form.reset(toDefaultValues(eventData.data));
    }
  }, [eventData, form, mode]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bouts"
  });
  const watchedBouts = useWatch({
    control: form.control,
    name: "bouts"
  });

  const { mutateAsync: createEventMutate, isPending: isCreating } = useCreateEvent();
  const { mutateAsync: updateEventMutate, isPending: isUpdatingEvent } = useUpdateEvent();
  const { mutateAsync: postResultMutate, isPending: isUpdatingResults } = usePostBoutResult();

  const isSubmitting = isCreating || isUpdatingEvent || isUpdatingResults;

  const onSubmit = async (values: EventFormValues) => {
    try {
      if (mode === "create" || (isEditMode && isUpcoming)) {
        const payload: ICreateEventPayload = {
          name: values.name,
          location: values.location,
          date: values.date,
          bouts: values.bouts.map((bout) => ({
            weightClass: bout.weightClass,
            rounds: bout.rounds,
            isMainEvent: bout.isMainEvent,
            isCoMainEvent: bout.isCoMainEvent,
            fighters: [
              { fighterId: bout.fighter1Id },
              { fighterId: bout.fighter2Id }
            ]
          }))
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(payload));

        const posterFile = values.posterDataUrl.startsWith("data:")
          ? dataURLtoFile(values.posterDataUrl, "poster.jpg")
          : null;

        if (posterFile) {
          formData.append("image", posterFile);
        }

        if (mode === "create") {
          await createEventMutate(formData);
          toast.success("Event published successfully.");
          form.reset();
        } else {
          await updateEventMutate({ id: eventId!, formData });
          toast.success("Event updated successfully.");
        }
      } else {
        // Edit mode: Post results for each bout
        const promises = values.bouts.map((bout: any) => {
          if (!bout.id || !bout.winnerId) return Promise.resolve();

          const resultPayload: IPostBoutResultPayload = {
            winnerId: bout.winnerId,
            ...(Object.fromEntries(
              SCORING_CRITERIA.map((c) => [c.key, bout.scoringCriteria[c.key]])
            ) as Omit<IPostBoutResultPayload, "winnerId">)
          };

          return postResultMutate({
            boutId: bout.id,
            payload: resultPayload
          });
        });

        await Promise.all(promises);
        toast.success("Event results updated successfully.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  if (isEditMode && isEventLoading) {
    return (
      <Card className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading event data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl font-semibold">
          {isEditMode 
            ? (isUpcoming ? "Edit Event Details" : "Update Bout Results") 
            : "Create UFC Event"}
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
                        disabled={isEditMode && !isUpcoming}
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
                      <Input type="date" {...field} disabled={isEditMode && !isUpcoming} />
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
                    <Input placeholder="e.g. Las Vegas, NV" {...field} disabled={isEditMode && !isUpcoming} />
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
                      {(!isEditMode || isUpcoming) && (
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
                      )}

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
                                  disabled={isEditMode && !isUpcoming}
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
                                  disabled={isEditMode && !isUpcoming}
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
                                  disabled={isEditMode && !isUpcoming}
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
                                  disabled={isEditMode && !isUpcoming}
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
                                  disabled={isEditMode && !isUpcoming}
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
                                  disabled={isEditMode && !isUpcoming}
                                />
                                Set as Co-Main Event
                              </label>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {isEditMode && !isUpcoming && (
                        <>
                          <FormField
                            control={form.control}
                            name={`bouts.${index}.winnerId`}
                            render={({ field: boutField }) => {
                              const fighterOneId = watchedBouts[index]?.fighter1Id;
                              const fighterTwoId = watchedBouts[index]?.fighter2Id;

                              return (
                                <FormItem>
                                  <FormLabel>Winner</FormLabel>
                                  <FormControl>
                                    <EventCombobox
                                      value={boutField.value}
                                      onValueChange={boutField.onChange}
                                      options={fighterOptions.filter(
                                        (fighter) =>
                                          String(fighter.value) === String(fighterOneId) ||
                                          String(fighter.value) === String(fighterTwoId)
                                      )}
                                      placeholder="Select winner"
                                      searchPlaceholder="Search winner..."
                                      disabled={isCompleted}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />

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
                                            {scoringSettings &&
                                              typeof scoringSettings[
                                                criterion.key as keyof typeof scoringSettings
                                              ] === "number" && (
                                                <span className="ml-1 rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-normal text-indigo-600">
                                                  +{scoringSettings[criterion.key as keyof typeof scoringSettings]} pts
                                                </span>
                                              )}
                                          </FormLabel>
                                          <p className="text-xs text-slate-600">{criterion.description}</p>
                                        </div>
                                        <FormControl>
                                          <Switch
                                            checked={criterionField.value}
                                            onCheckedChange={(value) => criterionField.onChange(Boolean(value))}
                                            disabled={isCompleted}
                                          />
                                        </FormControl>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>

                            {(form.formState.errors.bouts as any)?.[index]?.scoringCriteria?.message && (
                              <p className="text-sm text-destructive">
                                {(form.formState.errors.bouts as any)?.[index]?.scoringCriteria?.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}
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
                      disabled={isEditMode && !isUpcoming}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="min-w-40" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Rocket className="size-4 animate-bounce" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Rocket className="size-4" />
                    {isEditMode ? (isUpcoming ? "Update Event" : "Update Results") : "Publish Event"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
