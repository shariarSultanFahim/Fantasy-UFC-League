"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateNewsletter, useUpdateNewsletter } from "@/lib/actions/newsletter";
import { INewsletter } from "@/types/newsletter";
import { getImageUrl } from "@/lib/utils";

const newsletterSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

interface NewsletterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsletter?: INewsletter;
}

export function NewsletterFormModal({ isOpen, onClose, newsletter }: NewsletterFormModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate: createNewsletter, isPending: isCreating } = useCreateNewsletter();
  const { mutate: updateNewsletter, isPending: isUpdating } = useUpdateNewsletter();

  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (newsletter) {
      form.reset({
        title: newsletter.title,
        description: newsletter.description,
      });
      setImagePreview(newsletter.image || null);
    } else {
      form.reset({
        title: "",
        description: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [newsletter, form, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof newsletterSchema>) => {
    const payload = {
      data: values,
      image: imageFile || undefined,
    };

    if (newsletter) {
      updateNewsletter(
        { id: newsletter.id, payload },
        {
          onSuccess: () => {
            toast.success("Newsletter updated successfully.");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update newsletter.");
          },
        }
      );
    } else {
      createNewsletter(payload, {
        onSuccess: () => {
          toast.success("Newsletter created successfully.");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create newsletter.");
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden rounded-3xl border-none bg-white p-0 shadow-2xl">
        <DialogHeader className="bg-slate-50 px-8 py-6">
          <DialogTitle className="text-2xl font-black text-slate-900">
            {newsletter ? "Edit Newsletter" : "Create Newsletter"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-8 py-6">
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <FormLabel className="text-sm font-bold text-slate-700">Cover Image</FormLabel>
                <div className="relative group">
                  <div
                    className={`relative flex h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${imagePreview ? 'border-[#3dbcf9] bg-slate-50' : 'border-slate-200 bg-slate-50 hover:border-[#3dbcf9]'
                      }`}
                  >
                    {imagePreview ? (
                      <>
                        <Image
                          src={getImageUrl(imagePreview)}
                          alt="Preview"
                          unoptimized
                          fill
                          className="rounded-2xl object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="text-white hover:bg-white/20"
                          >
                            <X className="h-6 w-6" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <label htmlFor="image" className="flex flex-col items-center gap-2 text-slate-400 cursor-pointer">
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <ImagePlus className="h-10 w-10" />
                            <span className="text-sm font-medium">Click to upload image</span>
                          </div>
                        </label>
                        <Input
                          type="file"
                          id='image'
                          accept="image/*"
                          className="absolute inset-0 hidden cursor-pointer opacity-0"
                          onChange={handleImageChange}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UFC 300: Main Event Confirmed"
                        {...field}
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:border-[#3dbcf9] focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700">Description / Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your post content here..."
                        {...field}
                        className="min-h-[200px] resize-none rounded-xl border-slate-200 bg-slate-50 p-4 focus:border-[#3dbcf9] focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8 border-t border-slate-100 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Newsletter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
