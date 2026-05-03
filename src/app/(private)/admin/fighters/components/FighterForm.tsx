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
  Textarea
} from "@/components/ui";

import { fighterFormSchema, type FighterFormValues } from "../schema/fighter-form-schema";
import { FighterCombobox } from "./FighterCombobox";
import { FighterImageCropUploader } from "./FighterImageCropUploader";
import { useDivisions } from "@/hooks";
import React from "react";

interface FighterFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<FighterFormValues>;
  nationalityOptions: string[];
}

const defaultValues: FighterFormValues = {
  name: "",
  nickname: "",
  nationality: "",
  division: "",
  rank: 1,
  wins: 0,
  losses: 0,
  draws: 0,
  avgPoints: 0,
  bio: "",
  avatarDataUrl: ""
};

export function FighterForm({ mode, initialValues, nationalityOptions }: FighterFormProps) {
  const { divisions } = useDivisions({ limit: 100 }); // Fetch all divisions for the dropdown

  const form = useForm<FighterFormValues>({
    resolver: zodResolver(fighterFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues
    }
  });

  const divisionOptions = React.useMemo(() =>
    (divisions || []).map((d) => ({ value: d.id, label: d.name })),
    [divisions]
  );

  const nationalityMappedOptions = React.useMemo(() =>

    nationalityOptions.map((n) => ({ value: n, label: n })),
    [nationalityOptions]
  );

  const onSubmit = () => {
    toast.success(
      mode === "create"
        ? "Fighter profile created successfully!"
        : "Fighter profile updated successfully!",
      {
        position: "top-center"
      }
    );
  };

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
                name="division"
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

            <FormField
              control={form.control}
              name="avgPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Last Fight Point</FormLabel>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel>Bio</FormLabel>
                    <span className="text-xs text-muted-foreground">
                      {field.value.length} characters
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Write a short profile for this fighter..."
                      {...field}
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
                    <FighterImageCropUploader value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3">
              <Button type="submit" className="min-w-36">
                <Save className="size-4" />
                {mode === "create" ? "Create Fighter" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
