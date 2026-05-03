"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { divisionSchema, DivisionFormValues } from "../schema";
import { useDivisions } from "@/hooks";
import { IDivision } from "@/types";

interface DivisionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  division?: IDivision | null;
}

export function DivisionSheet({ open, onOpenChange, division }: DivisionSheetProps) {
  const { createDivision, updateDivision, isCreating, isUpdating } = useDivisions();
  const isEditing = !!division;

  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (division) {
      form.reset({
        name: division.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [division, form]);

  const onSubmit = async (values: DivisionFormValues) => {
    try {
      if (isEditing && division) {
        await updateDivision({ id: division.id, data: values });
      } else {
        await createDivision(values);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Failed to save division", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Division" : "Add New Division"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the division details below."
              : "Create a new weight division for the UFC roster."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Lightweight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4 px-0">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full"
              >
                {isCreating || isUpdating ? "Saving..." : isEditing ? "Update Division" : "Create Division"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
