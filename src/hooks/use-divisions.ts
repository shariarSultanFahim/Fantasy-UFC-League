import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch, post, del } from "@/lib/api";
import { IDivision, IPaginatedResponse, IApiResponse, IDivisionFormValues } from "@/types";
import { toast } from "sonner";

export function useDivisions(params?: { page?: number; limit?: number; searchTerm?: string }) {
  const queryClient = useQueryClient();

  const divisionsQuery = useQuery({
    queryKey: ["divisions", params],
    queryFn: ({ signal }) =>
      get<IPaginatedResponse<IDivision>>("/division", {
        params,
        signal
      }),
  });

  const createDivisionMutation = useMutation({
    mutationFn: (data: IDivisionFormValues) => post<IApiResponse<IDivision>>("/division", data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["divisions"] });
        toast.success(response.message || "Division created successfully", { position: "top-center" });
      } else {
        toast.error(response.message || "Failed to create division", { position: "top-center" });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred while creating division", { position: "top-center" });
    },
  });

  const updateDivisionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IDivisionFormValues }) =>
      patch<IApiResponse<IDivision>>(`/division/${id}`, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["divisions"] });
        toast.success(response.message || "Division updated successfully", { position: "top-center" });
      } else {
        toast.error(response.message || "Failed to update division", { position: "top-center" });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred while updating division", { position: "top-center" });
    },
  });

  const deleteDivisionMutation = useMutation({
    mutationFn: (id: string) => del<IApiResponse<null>>(`/division/${id}`),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["divisions"] });
        toast.success(response.message || "Division deleted successfully", { position: "top-center" });
      } else {
        toast.error(response.message || "Failed to delete division", { position: "top-center" });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred while deleting division", { position: "top-center" });
    },
  });

  return {
    divisions: divisionsQuery.data?.data?.data,
    meta: divisionsQuery.data?.data?.meta,
    isLoading: divisionsQuery.isLoading,
    isError: divisionsQuery.isError,
    createDivision: createDivisionMutation.mutateAsync,
    isCreating: createDivisionMutation.isPending,
    updateDivision: updateDivisionMutation.mutateAsync,
    isUpdating: updateDivisionMutation.isPending,
    deleteDivision: deleteDivisionMutation.mutateAsync,
    isDeleting: deleteDivisionMutation.isPending,
  };
}
