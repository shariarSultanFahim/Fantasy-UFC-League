import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch, post } from "@/lib/api";
import { User, IApiResponse } from "@/types";
import { toast } from "sonner";

export function useProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: ({ signal }) => get<IApiResponse<User>>("/auth/me", { signal }),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return patch<IApiResponse<User>, FormData>("/auth/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData(["profile"], response);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred while updating profile");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      return post<IApiResponse<null>>("/auth/change-password", data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Password changed successfully");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred while changing password");
    },
  });

  return {
    profile: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
}
