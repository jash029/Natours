import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../../../Services/reviewService/reviewService";

export function useReview() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });

  const addReview = async (data) => {
    return await mutation.mutateAsync(data);
  };

  return {
    addReview,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}
