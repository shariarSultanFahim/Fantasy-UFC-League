"use client";

import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  Input,
  Textarea,
  Switch
} from "@/components/ui";

import { fighterFormSchema, type FighterFormValues } from "../schema/fighter-form-schema";
import { FighterCombobox } from "./FighterCombobox";
import { FighterImageCropUploader } from "./FighterImageCropUploader";
import { useDivisions, useCreateFighter, useUpdateFighter, useFighter } from "@/hooks";
import React from "react";
import { useRouter } from "next/navigation";

interface FighterFormProps {
  mode: "create" | "edit";
  id?: string;
  initialValues?: Partial<FighterFormValues>;
  nationalityOptions: string[];
}

const defaultValues: FighterFormValues = {
  name: "",
  nickname: "",
  nationality: "",
  divisionId: "",
  rank: 1,
  wins: 0,
  losses: 0,
  draws: 0,
  avgL5: 0,
  bio: "",
  age: 25,
  height: "5'10\"",
  avatarDataUrl: "",
  isActive: true,
};

export function FighterForm({ mode, id, initialValues, nationalityOptions }: FighterFormProps) {
  const router = useRouter();
  const { divisions } = useDivisions({ limit: 100 });
  const { mutate: createFighter, isPending: isCreating } = useCreateFighter();
  const { mutate: updateFighter, isPending: isUpdating } = useUpdateFighter();
  const { data: fighterData, isLoading: isLoadingFighter } = useFighter(id || null);

  const form = useForm<FighterFormValues>({
    resolver: zodResolver(fighterFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues
    }
  });

  React.useEffect(() => {
    if (fighterData?.data && mode === "edit") {
      const fighter = fighterData.data;
      form.reset({
        name: fighter.name,
        nickname: fighter.nickname,
        nationality: fighter.nationality,
        divisionId: fighter.divisionId,
        rank: fighter.rank ?? 15,
        wins: fighter.wins,
        losses: fighter.losses,
        draws: fighter.draws,
        avgL5: fighter.avgL5,
        bio: fighter.bio || `${fighter.name} (${fighter.nickname}) is one of the most recognized names in the division.`,
        age: fighter.age || 25,
        height: fighter.height || "5'10\"",
        avatarDataUrl: fighter.avatarUrl || "",
        isActive: fighter.isActive,
      });
    }
  }, [fighterData, form, mode]);

  const divisionOptions = React.useMemo(() =>
    (divisions || []).map((d) => ({ value: d.id, label: d.name })),
    [divisions]
  );

  const nationalityMappedOptions = React.useMemo(() =>
    nationalityOptions.map((n) => ({ value: n, label: n })),
    [nationalityOptions]
  );

  const onSubmit = async (values: FighterFormValues) => {
    const data = {
      name: values.name,
      nickname: values.nickname,
      nationality: values.nationality,
      divisionId: values.divisionId,
      rank: values.rank,
      wins: values.wins,
      losses: values.losses,
      draws: values.draws,
      avgL5: values.avgL5,
      bio: values.bio,
      age: values.age,
      height: values.height,
      isActive: values.isActive,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (values.avatarDataUrl && values.avatarDataUrl.startsWith("data:")) {
      try {
        const response = await fetch(values.avatarDataUrl);
        const blob = await response.blob();
        formData.append("image", blob, "fighter.jpg");
      } catch (error) {
        console.error("Error converting image:", error);
        toast.error("Failed to process image");
        return;
      }
    }

    if (mode === "create") {
      createFighter(formData, {
        onSuccess: () => router.push("/admin/fighters")
      });
    } else if (mode === "edit" && id) {
      updateFighter({ id, formData }, {
        onSuccess: () => router.push("/admin/fighters")
      });
    }
  };

  const isPending = isCreating || isUpdating;

  if (mode === "edit" && isLoadingFighter) {
    return (
      <Card className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading fighter data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl font-semibold">
          {mode === "create" ? "New Fighter Profile" : "Edit Fighter Profile"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-6 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jon Jones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="divisionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <FighterCombobox
                        value={field.value}
                        options={divisionOptions}
                        placeholder="Select division"
                        searchPlaceholder="Search divisions..."
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <FighterCombobox
                        value={field.value}
                        options={nationalityMappedOptions}
                        placeholder="Select nationality"
                        searchPlaceholder="Search nationalities..."
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rank</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value === "" ? null : Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wins</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="losses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Losses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="draws"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Draws</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="avgL5"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avg L5 Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={18}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value === "" ? null : Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"e.g. 6'0\""}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value === "" ? null : event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel>Bio</FormLabel>
                    <span className="text-xs text-muted-foreground">
                      {field.value?.length || 0} characters
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Write a short profile for this fighter..."
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value === "" ? null : event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatarDataUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FighterImageCropUploader value={field.value ?? ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3">
              <Button type="submit" className="min-w-36" disabled={isPending}>
                <Save className="size-4" />
                {isPending ? "Saving..." : mode === "create" ? "Create Fighter" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
