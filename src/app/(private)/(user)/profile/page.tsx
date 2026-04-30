"use client";

import { useMe, useUpdateProfile } from "@/lib/actions/auth";
import { getImageUrl } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";

export default function ProfilePage() {
  const { data: userData, isLoading } = useMe();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    bio: "",
    location: ""
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name || "",
        username: user.username || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || ""
      });
      setPreviewUrl(user.avatarUrl || null);
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        data: formData,
        image: selectedFile || undefined
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Manage your profile information and preferences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Avatar Sidebar */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-2 border-slate-100">
                  <AvatarImage src={getImageUrl(previewUrl)} alt={formData.name} />
                  <AvatarFallback className="text-2xl bg-slate-100">
                    {formData.name?.slice(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>
                <div className="relative">
                  <Button variant="outline" size="sm" className="relative cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                    <input
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Button>
                </div>
                <p className="text-center text-xs text-slate-500">
                  JPG, GIF or PNG. Max size of 2MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                This information will be displayed publicly on your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={userData?.data?.email}
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-[10px] text-slate-400">Email cannot be changed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your MMA passion..."
                    className="resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isPending} className="px-8">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
