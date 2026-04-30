"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  Camera,
  Clock3,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Save,
  ShieldCheck,
  X
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { AdminProfileFormValues } from "../schema/profile-form-schema";
import { getImageUrl } from "@/lib/utils";

import { useProfile } from "@/hooks";
import { profileFormSchema } from "../schema/profile-form-schema";
import { Loader2 } from "lucide-react";

function getDeviceTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown timezone";
}

export function ProfileSummaryCard() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      bio: ""
    }
  });

  // Update form when profile data is loaded, but only if not editing
  useEffect(() => {
    if (profile && !isEditing) {
      form.reset({
        name: profile.name,
        role: profile.role,
        email: profile.email,
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || ""
      });
    }
  }, [profile, form, isEditing]);

  const startEditing = () => {
    form.reset({
      name: profile?.name || "",
      role: profile?.role || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      bio: profile?.bio || ""
    });
    setSelectedImageFile(null);
    setImagePreview(profile?.avatarUrl);
    setIsEditing(true);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImageFile(file);

    if (!file) {
      setImagePreview(profile?.avatarUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const cancelEditing = () => {
    form.reset({
      name: profile?.name || "",
      role: profile?.role || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      bio: profile?.bio || ""
    });
    setSelectedImageFile(null);
    setImagePreview(profile?.avatarUrl);
    setFileInputKey((currentKey) => currentKey + 1);

    setIsEditing(false);
  };

  const handleSubmit = async (values: AdminProfileFormValues) => {
    const formData = new FormData();
    const { role, email, ...updateData } = values; // Role and email are usually not updatable via this endpoint
    
    formData.append("data", JSON.stringify(updateData));
    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    }

    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSelectedImageFile(null);
      setFileInputKey((currentKey) => currentKey + 1);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  if (isLoading || !profile) {
    return (
      <Card className="flex h-[400px] items-center justify-center border-border/60 bg-card/95 shadow-sm">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </Card>
    );
  }

  const profileDetails = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone || "Not provided"
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile.location || "Not provided"
    },
    {
      icon: Clock3,
      label: "Timezone",
      value: getDeviceTimezone()
    }
  ];

  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/95 py-0 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-r from-slate-950 via-blue-950 to-sky-800" />

      {isEditing ? (
        <CardContent className="relative space-y-6 px-5 pt-7 pb-6 sm:px-6 sm:pb-7">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Profile editor
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Edit Profile</h2>
            </div>
            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Draft</Badge>
          </div>

          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="rounded-2xl border border-border/60 bg-slate-50/80 p-4">
              <div className="relative mx-auto w-fit">
                <Avatar className="size-24 border-4 border-background shadow-lg shadow-slate-950/10">
                  <AvatarImage src={getImageUrl(imagePreview)} alt={`Portrait of ${profile.name}`} />
                  <AvatarFallback className="text-base font-semibold text-slate-700">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <input
                  key={fileInputKey}
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  id="profile-image"
                  type="file"
                  onChange={handleImageChange}
                />

                <Button
                  aria-label="Upload new profile image"
                  className="absolute right-0 bottom-0 size-9 rounded-full border-2 border-background shadow-lg shadow-slate-950/20"
                  size="icon"
                  type="button"
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="size-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name?.message && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.name.message)}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="role">Role</Label>
                <Input id="role" {...form.register("role")} disabled />
                {form.formState.errors.role?.message && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.role.message)}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} disabled />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.email.message)}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone?.message && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.phone.message)}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} />
                {form.formState.errors.location?.message && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.location.message)}</p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  disabled
                  value={getDeviceTimezone()}
                  className="bg-background/60 text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={4} {...form.register("bio")} />
              {form.formState.errors.bio?.message && (
                <p className="text-sm text-destructive">{String(form.formState.errors.bio.message)}</p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                className="w-full sm:w-auto"
                type="button"
                variant="outline"
                onClick={cancelEditing}
              >
                <X className="size-4" />
                Cancel
              </Button>
              <Button 
                className="w-full shadow-lg shadow-slate-950/10 sm:w-auto" 
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="size-4" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      ) : (
        <>
          <CardContent className="relative space-y-6 px-5 pt-7 pb-6 sm:px-6 sm:pb-7">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-28 border-4 border-background shadow-xl shadow-slate-950/20">
                <AvatarImage src={getImageUrl(profile.avatarUrl)} alt={`Portrait of ${profile.name}`} />
                <AvatarFallback className="text-lg font-semibold text-slate-700">
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {profile.name}
                  </h2>
                  <ShieldCheck className="size-5 text-emerald-600" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-slate-600">{profile.role}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                  Verified
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 hover:bg-slate-100"
                >
                  Priority Access
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              {profileDetails.map((detail) => {
                const Icon = detail.icon;

                return (
                  <div key={detail.label} className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                        {detail.label}
                      </p>
                      <p className="text-sm font-medium text-slate-900">{detail.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Bio
              </p>
              <p className="text-sm leading-6 text-slate-700">{profile.bio}</p>
            </div>
          </CardContent>

          <CardFooter className="px-5 pt-0 pb-5 sm:px-6">
            <Button
              className="w-full shadow-lg shadow-slate-950/10"
              size="lg"
              type="button"
              onClick={startEditing}
            >
              <PencilLine className="size-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
